import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/analytics — fetch analytics stats (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Today's counts
    const [todayPageViews, todayProductViews, todayWhatsappClicks, todayCartAdds] = await Promise.all([
      db.analyticsEvent.count({ where: { type: "page_view", createdAt: { gte: today } } }),
      db.analyticsEvent.count({ where: { type: "product_view", createdAt: { gte: today } } }),
      db.analyticsEvent.count({ where: { type: "whatsapp_click", createdAt: { gte: today } } }),
      db.analyticsEvent.count({ where: { type: "cart_add", createdAt: { gte: today } } }),
    ]);

    // Last 7 days daily breakdown — build as array for the chart
    const last7DaysEvents = await db.analyticsEvent.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { type: true, createdAt: true },
    });

    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailyMap[key] = 0;
    }

    for (const event of last7DaysEvents) {
      const key = event.createdAt.toISOString().split("T")[0];
      if (key in dailyMap) {
        dailyMap[key]++;
      }
    }

    // Convert to array format expected by frontend: { date, count }
    const dailyViews = Object.entries(dailyMap).map(([date, count]) => ({
      date: date.slice(5), // "MM-DD" format for display
      count,
    }));

    // Most viewed products (last 30 days) — return { title, views }
    const productViewEvents = await db.analyticsEvent.findMany({
      where: { type: "product_view", createdAt: { gte: thirtyDaysAgo } },
      select: { productId: true, metadata: true },
    });

    const productViewCounts: Record<string, { count: number; title: string }> = {};
    for (const pv of productViewEvents) {
      if (!pv.productId) continue;
      if (!productViewCounts[pv.productId]) {
        let title = pv.productId;
        try {
          title = JSON.parse(pv.metadata || "{}").title || pv.productId;
        } catch {
          // keep default title
        }
        productViewCounts[pv.productId] = { count: 0, title };
      }
      productViewCounts[pv.productId].count++;
    }

    const topProducts = Object.values(productViewCounts)
      .map(({ count, title }) => ({ title, views: count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Page views by page (last 30 days) — return { path, views }
    const pageViewEvents = await db.analyticsEvent.findMany({
      where: { type: "page_view", createdAt: { gte: thirtyDaysAgo } },
      select: { page: true },
    });

    const pageCounts: Record<string, number> = {};
    for (const pv of pageViewEvents) {
      const p = pv.page || "/";
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    }

    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, views: count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Recent events (last 50) — only return fields the frontend needs
    const recentEventsRaw = await db.analyticsEvent.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    const recentEvents = recentEventsRaw.map((ev) => ({
      type: ev.type,
      page: ev.page || "",
      createdAt: ev.createdAt.toISOString(),
    }));

    return NextResponse.json({
      today: {
        pageViews: todayPageViews,
        productViews: todayProductViews,
        whatsappClicks: todayWhatsappClicks,
        cartAdds: todayCartAdds,
      },
      dailyViews,
      topProducts,
      topPages,
      recentEvents,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

// POST /api/analytics — log an analytics event (public, no auth needed)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, page, productId, metadata } = body;

    if (!type) {
      return NextResponse.json({ error: "Missing event type" }, { status: 400 });
    }

    await db.analyticsEvent.create({
      data: {
        type,
        page: page || null,
        productId: productId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error logging analytics event:", error);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
