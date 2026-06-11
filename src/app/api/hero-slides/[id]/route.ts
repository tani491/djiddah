import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getFallbackHeroSlideById } from "@/lib/fallback-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/hero-slides/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!process.env.DATABASE_URL) {
      const fallbackSlide = getFallbackHeroSlideById(id);
      if (!fallbackSlide) {
        return NextResponse.json({ error: "Slide non trouve." }, { status: 404 });
      }
      return NextResponse.json(fallbackSlide);
    }

    const slide = await db.heroSlide.findUnique({ where: { id } });

    if (!slide) {
      return NextResponse.json({ error: "Slide non trouve." }, { status: 404 });
    }

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Error fetching hero slide:", error);
    const fallbackSlide = getFallbackHeroSlideById(id);
    if (fallbackSlide) {
      return NextResponse.json(fallbackSlide);
    }
    return NextResponse.json({ error: "Failed to fetch hero slide" }, { status: 500 });
  }
}

// PUT /api/hero-slides/[id] - update a hero slide
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins can update slides
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const slide = await db.heroSlide.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.alt !== undefined && { alt: body.alt }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.active !== undefined && { active: body.active }),
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return NextResponse.json({ error: "Failed to update hero slide" }, { status: 500 });
  }
}

// DELETE /api/hero-slides/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins can delete slides
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;
    await db.heroSlide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json({ error: "Failed to delete hero slide" }, { status: 500 });
  }
}
