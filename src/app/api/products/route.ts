import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const storage = searchParams.get("storage");
    const condition = searchParams.get("condition");
    const color = searchParams.get("color");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = {};

    if (category && category !== "all") where.category = category;
    if (subCategory) where.subCategory = subCategory;
    if (storage) where.storage = storage;
    if (condition) where.condition = condition;
    if (color) where.color = color;
    if (featured === "true") where.featured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = parseInt(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseInt(maxPrice);
    }
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Auth check — only admins can create products
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const product = await db.product.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        subCategory: body.subCategory || null,
        price: body.price,
        discountPercentage: body.discountPercentage ?? null,
        promoLabel: body.promoLabel || null,
        images: JSON.stringify(body.images || []),
        storage: body.storage || null,
        batteryHealth: body.batteryHealth || null,
        condition: body.condition || null,
        color: body.color || null,
        inStock: body.inStock ?? true,
        featured: body.featured ?? false,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
