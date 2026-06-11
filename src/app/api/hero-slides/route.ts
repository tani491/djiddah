import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getFallbackHeroSlides } from "@/lib/fallback-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/hero-slides — fetch all hero slides (active only by default)
export async function GET(req: NextRequest) {
  const activeOnly = req.nextUrl.searchParams.get("active") === "true";

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(getFallbackHeroSlides({ activeOnly }));
    }

    const slides = await db.heroSlide.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json(getFallbackHeroSlides({ activeOnly }));
  }
}

// POST /api/hero-slides — create a new hero slide
export async function POST(req: NextRequest) {
  try {
    // Auth check — only admins can create slides
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { title, image, alt, order, active } = body;

    if (!title || !image || !alt) {
      return NextResponse.json(
        { error: "Les champs titre, image et alt sont requis." },
        { status: 400 }
      );
    }

    // If no order specified, place it at the end
    const maxOrder = await db.heroSlide.aggregate({ _max: { order: true } });
    const slideOrder = order ?? (maxOrder._max.order ?? -1) + 1;

    const slide = await db.heroSlide.create({
      data: {
        title,
        image,
        alt,
        order: slideOrder,
        active: active ?? true,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error("Error creating hero slide:", error);
    return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 });
  }
}
