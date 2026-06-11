import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabase, STORAGE_BUCKET } from "@/lib/supabase";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function ensureStorageBucket() {
  const supabase = getSupabase();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  const bucketExists = buckets?.some((bucket) => bucket.name === STORAGE_BUCKET);
  if (!bucketExists) {
    const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      allowedMimeTypes: ALLOWED_IMAGE_TYPES,
      fileSizeLimit: MAX_FILE_SIZE,
    });

    if (createError) {
      throw new Error(createError.message);
    }
  }

  return supabase;
}

export async function POST(request: Request) {
  try {
    // Auth check — only admins can upload
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format image non supporté. Utilisez JPG, PNG, WEBP ou GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image trop lourde. Taille maximale : 4 Mo." },
        { status: 400 }
      );
    }

    const supabase = await ensureStorageBucket();

    // Generate a unique file path
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `admin/${randomUUID()}-${safeName}`;

    // Convert File to ArrayBuffer then to Buffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage (public bucket)
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type || "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Impossible d'envoyer l'image." },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Impossible d'envoyer l'image." },
      { status: 500 }
    );
  }
}
