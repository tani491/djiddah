import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/admin/change-password
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères." }, { status: 400 });
    }

    // Find the admin user
    const admin = await db.adminUser.findUnique({
      where: { email: session.user?.email || "" },
    });

    if (!admin) {
      return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 404 });
    }

    // Verify current password
    const bcrypt = await import("bcryptjs");
    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.adminUser.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Erreur lors du changement de mot de passe." }, { status: 500 });
  }
}
