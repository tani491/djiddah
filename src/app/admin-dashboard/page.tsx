"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  GripVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Settings,
  Lock,
  MousePointerClick,
  MessageCircle,
  ShoppingCart,
  Percent,
  Tag,
} from "lucide-react";
import Image from "next/image";

const ADMIN_UPLOAD_MAX_FILE_SIZE = 4 * 1024 * 1024;

// ─── Auth Guard Component ─────────────────────────────────
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}

// ─── Admin Shell ──────────────────────────────────────────
function AdminShell({ children, activeTab }: { children: React.ReactNode; activeTab: string }) {
  const navItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, href: "/admin-dashboard" },
    { id: "products", label: "Produits", icon: Package, href: "/admin-dashboard?tab=products" },
    { id: "hero", label: "Hero Section", icon: ImageIcon, href: "/admin-dashboard?tab=hero" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin-dashboard?tab=analytics" },
    { id: "settings", label: "Paramètres", icon: Settings, href: "/admin-dashboard?tab=settings" },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-950 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 hidden lg:flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-sm font-semibold tracking-tight text-white">DJIDAH</span>
            <span className="text-sm font-light tracking-tight text-neutral-600">ADMIN</span>
          </div>

          <nav className="flex-1 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === item.id
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-500 hover:text-red-400 hover:bg-neutral-800/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-neutral-800">
            <span className="text-sm font-semibold text-white">ADMIN</span>
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`p-2 rounded-lg ${
                    activeTab === item.id ? "bg-neutral-800 text-white" : "text-neutral-500"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                </Link>
              ))}
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="p-2 text-neutral-500 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState({ total: 0, iphones: 0, gadgets: 0, featured: 0 });
  const [recentProducts, setRecentProducts] = useState<Array<{ id: string; title: string; price: number; category: string; images: string }>>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: unknown) => {
        const products = Array.isArray(data)
          ? data as Array<{ category: string; featured: boolean; id: string; title: string; price: number; images: string }>
          : [];

        setStats({
          total: products.length,
          iphones: products.filter((p) => p.category === "iphone").length,
          gadgets: products.filter((p) => p.category === "gadget").length,
          featured: products.filter((p) => p.featured).length,
        });
        setRecentProducts(products.slice(0, 5));
      });
  }, []);

  const statCards = [
    { label: "Total Produits", value: stats.total },
    { label: "iPhones", value: stats.iphones },
    { label: "Gadgets", value: stats.gadgets },
    { label: "En Vedette", value: stats.featured },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <p className="text-xs text-neutral-500 mb-1">{card.label}</p>
            <p className="text-2xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-medium text-white mb-4">Produits récents</h2>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Produit</th>
              <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Catégorie</th>
              <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Prix</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map((p) => {
              const imgs = JSON.parse(p.images || "[]") as string[];
              return (
                <tr key={p.id} className="border-b border-neutral-800/50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 bg-neutral-800 rounded-lg flex-shrink-0">
                        {imgs[0] && <Image src={imgs[0]} alt="" fill className="object-contain p-1" sizes="32px" />}
                      </div>
                      <span className="text-sm text-neutral-300">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-neutral-500">{p.category}</td>
                  <td className="px-5 py-3 text-sm text-neutral-300">
                    {new Intl.NumberFormat("fr-FR").format(p.price)} FCFA
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Hero Section Tab ─────────────────────────────────────
interface HeroSlideItem {
  id: string;
  title: string;
  image: string;
  alt: string;
  order: number;
  active: boolean;
}

function HeroTab() {
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSlide, setEditSlide] = useState<HeroSlideItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/hero-slides");
      const data: unknown = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchSlides();
  };

  const toggleActive = async (slide: HeroSlideItem) => {
    await fetch(`/api/hero-slides/${slide.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !slide.active }),
    });
    fetchSlides();
  };

  const moveSlide = async (slide: HeroSlideItem, direction: "up" | "down") => {
    const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
    const currentIndex = sortedSlides.findIndex((s) => s.id === slide.id);

    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === sortedSlides.length - 1) return;

    const swapWith = direction === "up" ? sortedSlides[currentIndex - 1] : sortedSlides[currentIndex + 1];

    // Swap orders
    await Promise.all([
      fetch(`/api/hero-slides/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: swapWith.order }),
      }),
      fetch(`/api/hero-slides/${swapWith.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: slide.order }),
      }),
    ]);

    fetchSlides();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Hero Section</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Gérez les produits qui apparaissent dans le carrousel de la page d&apos;accueil
          </p>
        </div>
        <button
          onClick={() => {
            setEditSlide(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un slide
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <ImageIcon className="w-5 h-5 text-[#E30613] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-neutral-300 font-medium">Conseil</p>
            <p className="text-xs text-neutral-500 mt-0.5">
              Les slides actifs s&apos;affichent dans le carrousel de la page d&apos;accueil. Utilisez les flèches pour réorganiser l&apos;ordre d&apos;affichage. Désactivez un slide sans le supprimer en cliquant sur l&apos;icône œil.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-neutral-900 h-20 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
          <ImageIcon className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 mb-1">Aucun slide pour le moment</p>
          <p className="text-xs text-neutral-600">Ajoutez des produits au carrousel de la page d&apos;accueil</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...slides]
            .sort((a, b) => a.order - b.order)
            .map((slide, index) => (
              <div
                key={slide.id}
                className={`bg-neutral-900 border rounded-xl p-4 flex items-center gap-4 transition-colors ${
                  slide.active ? "border-neutral-800" : "border-neutral-800/50 opacity-60"
                }`}
              >
                {/* Grip + Order */}
                <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                  <GripVertical className="w-4 h-4 text-neutral-600" />
                  <span className="text-[10px] text-neutral-600 font-mono">#{slide.order}</span>
                </div>

                {/* Image Preview */}
                <div className="relative w-16 h-16 bg-neutral-800 rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200 truncate">{slide.title}</p>
                  <p className="text-xs text-neutral-600 truncate mt-0.5">{slide.image}</p>
                </div>

                {/* Status */}
                <span
                  className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
                    slide.active
                      ? "bg-green-500/10 text-green-400"
                      : "bg-neutral-800 text-neutral-500"
                  }`}
                >
                  {slide.active ? "Actif" : "Inactif"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Move Up */}
                  <button
                    onClick={() => moveSlide(slide, "up")}
                    disabled={index === 0}
                    className="p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Monter"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  {/* Move Down */}
                  <button
                    onClick={() => moveSlide(slide, "down")}
                    disabled={index === slides.length - 1}
                    className="p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Descendre"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  {/* Toggle Active */}
                  <button
                    onClick={() => toggleActive(slide)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                    title={slide.active ? "Désactiver" : "Activer"}
                  >
                    {slide.active ? (
                      <Eye className="w-4 h-4 text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditSlide(slide);
                      setShowForm(true);
                    }}
                    className="p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => setDeleteId(slide.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Hero Slide Form Modal */}
      {showForm && (
        <HeroSlideFormModal
          slide={editSlide}
          onClose={() => {
            setShowForm(false);
            setEditSlide(null);
          }}
          onSave={fetchSlides}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-white mb-2">Supprimer ce slide ?</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Ce slide sera retiré du carrousel de la page d&apos;accueil.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 text-sm text-neutral-400 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Hero Slide Form Modal ────────────────────────────────
function HeroSlideFormModal({
  slide,
  onClose,
  onSave,
}: {
  slide: HeroSlideItem | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: slide?.title || "",
    image: slide?.image || "",
    alt: slide?.alt || "",
    active: slide?.active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const input = e.currentTarget;
    if (file.size > ADMIN_UPLOAD_MAX_FILE_SIZE) {
      alert("Image trop lourde. Taille maximale : 4 Mo.");
      input.value = "";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload impossible.");
      }
      if (data.url) {
        setForm((current) => ({
          ...current,
          image: data.url || "",
          alt: current.alt || file.name.replace(/\.[^.]+$/, ""),
        }));
      } else if (data.error) {
        alert("Erreur upload : " + data.error);
      }
    } catch {
      alert("Erreur réseau lors de l'upload.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      alert("Veuillez uploader une image avant d'enregistrer.");
      return;
    }

    setSaving(true);

    try {
      if (slide) {
        await fetch(`/api/hero-slides/${slide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/hero-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      onSave();
      onClose();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h3 className="text-lg font-medium text-white">
            {slide ? "Modifier le slide" : "Nouveau slide"}
          </h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">Titre affiché</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="ex: iPhone 15 Pro Max"
              required
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600"
            />
            <p className="text-[10px] text-neutral-600 mt-1">
              Ce texte s&apos;affiche sous le produit dans le carrousel
            </p>
          </div>

          {/* Image */}
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">Image du produit</label>
            {/* Preview */}
            {form.image && (
              <div className="relative w-32 h-32 bg-neutral-800 rounded-xl mb-3 overflow-hidden">
                <Image
                  src={form.image}
                  alt="Aperçu"
                  fill
                  className="object-contain p-2"
                  sizes="128px"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div>
              <label className={`inline-flex w-full items-center justify-center gap-2 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 transition-colors ${
                uploading ? "cursor-wait opacity-70" : "cursor-pointer hover:text-white hover:border-neutral-500"
              }`}>
                <Upload className="w-4 h-4" />
                {uploading ? "Upload en cours..." : form.image ? "Remplacer l'image" : "Choisir une image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-neutral-600 mt-1">
              Utilisez une image PNG avec fond transparent pour un rendu optimal
            </p>
          </div>

          {/* Alt text */}
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">Texte alternatif (accessibilité)</label>
            <input
              type="text"
              value={form.alt}
              onChange={(e) => setForm({ ...form, alt: e.target.value })}
              placeholder="ex: iPhone 15 Pro Max"
              required
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600"
            />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-white"
            />
            <span className="text-sm text-neutral-300">Slide actif (visible sur le site)</span>
          </label>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-neutral-400 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 text-sm text-neutral-900 bg-white rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────
interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string | null;
  price: number;
  discountPercentage?: number | null;
  promoLabel?: string | null;
  images: string;
  storage?: string | null;
  batteryHealth?: string | null;
  condition?: string | null;
  color?: string | null;
  inStock: boolean;
  featured: boolean;
}

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data: unknown = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">Produits</h1>
        <button
          onClick={() => {
            setEditProduct(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-neutral-900 h-16 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Produit</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Catégorie</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Prix</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Promo</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Stock</th>
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const imgs = JSON.parse(p.images || "[]") as string[];
                  return (
                    <tr key={p.id} className="border-b border-neutral-800/50 last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-neutral-800 rounded-lg flex-shrink-0">
                            {imgs[0] && <Image src={imgs[0]} alt="" fill className="object-contain p-1" sizes="40px" />}
                          </div>
                          <div>
                            <p className="text-sm text-neutral-300">{p.title}</p>
                            {p.storage && <p className="text-xs text-neutral-600">{p.storage}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-neutral-500 capitalize">{p.category}</td>
                      <td className="px-5 py-3">
                        <div className="text-sm text-neutral-300">
                          {new Intl.NumberFormat("fr-FR").format(p.price)} FCFA
                          {p.discountPercentage && (
                            <span className="block text-xs text-green-400 font-medium">
                              {new Intl.NumberFormat("fr-FR").format(Math.round(p.price * (1 - p.discountPercentage / 100)))} FCFA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {p.discountPercentage ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-[#E30613]/10 text-[#E30613] font-medium">
                            -{p.discountPercentage}%{p.promoLabel ? ` ${p.promoLabel}` : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${p.inStock ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                          {p.inStock ? "En stock" : "Rupture"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditProduct(p);
                              setShowForm(true);
                            }}
                            className="p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editProduct}
          onClose={() => {
            setShowForm(false);
            setEditProduct(null);
          }}
          onSave={fetchProducts}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-white mb-2">Supprimer le produit ?</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Cette action est irréversible.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 text-sm text-neutral-400 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Product Form Modal ───────────────────────────────────
function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: product?.title || "",
    description: product?.description || "",
    category: product?.category || "iphone",
    subCategory: product?.subCategory || "",
    price: product?.price?.toString() || "",
    discountPercentage: product?.discountPercentage?.toString() || "",
    promoLabel: product?.promoLabel || "",
    storage: product?.storage || "",
    batteryHealth: product?.batteryHealth || "",
    condition: product?.condition || "Neuf",
    color: product?.color || "",
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
  });
  const [imageUrls, setImageUrls] = useState<string[]>(
    product ? (JSON.parse(product.images || "[]") as string[]) : []
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const input = e.currentTarget;
    if (file.size > ADMIN_UPLOAD_MAX_FILE_SIZE) {
      alert("Image trop lourde. Taille maximale : 4 Mo.");
      input.value = "";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload impossible.");
      }
      if (data.url) {
        const uploadedUrl = data.url;
        setImageUrls((prev) => [...prev, uploadedUrl]);
      } else if (data.error) {
        alert("Erreur upload : " + data.error);
      }
    } catch {
      alert("Erreur réseau lors de l'upload.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      alert("Veuillez uploader au moins une image avant d'enregistrer.");
      return;
    }

    setSaving(true);

    const body = {
      ...form,
      price: parseInt(form.price),
      discountPercentage: form.discountPercentage ? parseInt(form.discountPercentage) : null,
      promoLabel: form.promoLabel || null,
      images: imageUrls,
      subCategory: form.subCategory || null,
      storage: form.storage || null,
      batteryHealth: form.batteryHealth || null,
      condition: form.condition || null,
      color: form.color || null,
    };

    try {
      if (product) {
        await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      onSave();
      onClose();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h3 className="text-lg font-medium text-white">
            {product ? "Modifier le produit" : "Nouveau produit"}
          </h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">Titre</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500 resize-none"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-500 block mb-1.5">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: "" })}
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
              >
                <option value="iphone">iPhone</option>
                <option value="autre-marque-telephone">Autre marque de téléphone</option>
                <option value="gadget">Gadget</option>
                <option value="accessoire">Accessoire</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-500 block mb-1.5">Prix (FCFA)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {/* Promo / Discount Section */}
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#E30613]" />
              <span className="text-sm font-medium text-neutral-300">Promo / Réduction</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1.5">Réduction (%)</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={form.discountPercentage}
                  onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                  placeholder="ex: 20"
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
                />
                <p className="text-[10px] text-neutral-600 mt-1">
                  Laissez vide si pas de promo
                </p>
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1.5">Label promo</label>
                <select
                  value={form.promoLabel}
                  onChange={(e) => setForm({ ...form, promoLabel: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
                >
                  <option value="">Aucun</option>
                  <option value="PROMO">PROMO</option>
                  <option value="SOLDE">SOLDE</option>
                  <option value="VENTE FLASH">VENTE FLASH</option>
                  <option value="OFFRE LIMITÉE">OFFRE LIMITÉE</option>
                  <option value="NOUVEAU">NOUVEAU</option>
                </select>
              </div>
            </div>
            {/* Preview of discounted price */}
            {form.discountPercentage && form.price && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-neutral-500 line-through">
                  {new Intl.NumberFormat("fr-FR").format(parseInt(form.price) || 0)} FCFA
                </span>
                <span className="text-green-400 font-semibold">
                  {new Intl.NumberFormat("fr-FR").format(Math.round((parseInt(form.price) || 0) * (1 - parseInt(form.discountPercentage) / 100)))} FCFA
                </span>
                <span className="text-[#E30613] font-medium">-{form.discountPercentage}%</span>
              </div>
            )}
          </div>

          {/* Accessoire-specific sub-category */}
          {form.category === "accessoire" && (
            <div>
              <label className="text-xs text-neutral-500 block mb-1.5">Type d&apos;accessoire</label>
              <select
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
              >
                <option value="">—</option>
                <option value="coque">Coque</option>
                <option value="protecteur">Protège-écran</option>
                <option value="chargeur">Chargeur</option>
                <option value="cable">Câble</option>
                <option value="ecouteur">Écouteur</option>
                <option value="bracelet">Bracelet</option>
                <option value="support">Support</option>
                <option value="batterie">Batterie externe</option>
              </select>
            </div>
          )}

          {/* iPhone-specific fields */}
          {(form.category === "iphone" || form.category === "autre-marque-telephone") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1.5">Stockage</label>
                <select
                  value={form.storage}
                  onChange={(e) => setForm({ ...form, storage: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
                >
                  <option value="">—</option>
                  <option value="64GB">64GB</option>
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1.5">Santé batterie</label>
                <input
                  type="text"
                  value={form.batteryHealth}
                  onChange={(e) => setForm({ ...form, batteryHealth: e.target.value })}
                  placeholder="100%"
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>
          )}

          {/* Condition & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-500 block mb-1.5">État</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
              >
                <option value="Neuf">Neuf</option>
                <option value="Reconditionné">Reconditionné</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-500 block mb-1.5">Couleur</label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                className="w-4 h-4 accent-white"
              />
              <span className="text-sm text-neutral-300">En stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-white"
              />
              <span className="text-sm text-neutral-300">En vedette</span>
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">Images</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-16 h-16 bg-neutral-800 rounded-lg overflow-hidden group">
                  <Image src={url} alt="" fill className="object-contain p-1" sizes="64px" />
                  <button
                    type="button"
                    onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label className={`inline-flex w-full items-center justify-center gap-2 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 transition-colors ${
                uploading ? "cursor-wait opacity-70" : "cursor-pointer hover:text-white hover:border-neutral-500"
              }`}>
                <Upload className="w-4 h-4" />
                {uploading ? "Upload en cours..." : "Choisir une image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-neutral-400 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 text-sm text-neutral-900 bg-white rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────
const EVENT_TYPE_LABELS: Record<string, string> = {
  page_view: "Page vue",
  product_view: "Produit vu",
  whatsapp_click: "Click WhatsApp",
  cart_add: "Ajout panier",
  repair_click: "Demande réparation",
};

interface AnalyticsData {
  today: {
    pageViews: number;
    productViews: number;
    whatsappClicks: number;
    cartAdds: number;
  };
  dailyViews: Array<{ date: string; count: number }>;
  topProducts: Array<{ title: string; views: number }>;
  topPages: Array<{ path: string; views: number }>;
  recentEvents: Array<{ type: string; page: string; createdAt: string }>;
}

function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-white mb-8">Analytics</h1>
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 h-24 animate-pulse" />
            ))}
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 h-52 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 h-52 animate-pulse" />
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 h-52 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-white mb-8">Analytics</h1>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
          <BarChart3 className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500">Impossible de charger les données</p>
        </div>
      </div>
    );
  }

  const overviewCards = [
    { label: "Pages vues", value: data.today.pageViews, icon: Eye, color: "text-blue-400" },
    { label: "Vues produits", value: data.today.productViews, icon: MousePointerClick, color: "text-amber-400" },
    { label: "Clicks WhatsApp", value: data.today.whatsappClicks, icon: MessageCircle, color: "text-green-400" },
    { label: "Ajouts panier", value: data.today.cartAdds, icon: ShoppingCart, color: "text-purple-400" },
  ];

  const maxDaily = Math.max(...data.dailyViews.map((d) => d.count), 1);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-8">Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewCards.map((card) => (
          <div key={card.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-neutral-500">{card.label}</p>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className="text-2xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* 7-Day Bar Chart */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-medium text-neutral-300 mb-4">Vues des 7 derniers jours</h2>
        <div className="flex items-end gap-2 h-40">
          {data.dailyViews.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-neutral-500">{day.count}</span>
              <div
                className="w-full bg-[#E30613] rounded-t-sm transition-all"
                style={{ height: `${Math.max((day.count / maxDaily) * 100, 2)}%` }}
              />
              <span className="text-[10px] text-neutral-600">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Top Products */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-300">Top produits vus</h2>
          </div>
          {data.topProducts.length === 0 ? (
            <div className="p-5 text-sm text-neutral-600 text-center">Aucune donnée</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-2">Produit</th>
                  <th className="text-right text-xs text-neutral-500 font-medium px-5 py-2">Vues</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p, i) => (
                  <tr key={i} className="border-b border-neutral-800/50 last:border-0">
                    <td className="px-5 py-2 text-sm text-neutral-300 truncate max-w-[200px]">{p.title}</td>
                    <td className="px-5 py-2 text-sm text-neutral-400 text-right">{p.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Pages */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-300">Top pages</h2>
          </div>
          {data.topPages.length === 0 ? (
            <div className="p-5 text-sm text-neutral-600 text-center">Aucune donnée</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left text-xs text-neutral-500 font-medium px-5 py-2">Page</th>
                  <th className="text-right text-xs text-neutral-500 font-medium px-5 py-2">Vues</th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.map((p, i) => (
                  <tr key={i} className="border-b border-neutral-800/50 last:border-0">
                    <td className="px-5 py-2 text-sm text-neutral-300 truncate max-w-[200px]">{p.path}</td>
                    <td className="px-5 py-2 text-sm text-neutral-400 text-right">{p.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-300">Événements récents</h2>
        </div>
        {data.recentEvents.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600 text-center">Aucun événement</div>
        ) : (
          <div className="divide-y divide-neutral-800/50">
            {data.recentEvents.map((ev, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                    {EVENT_TYPE_LABELS[ev.type] || ev.type}
                  </span>
                  <span className="text-sm text-neutral-300 truncate max-w-[250px]">{ev.page}</span>
                </div>
                <span className="text-xs text-neutral-600">
                  {new Date(ev.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings Tab ──────────────────────────────────────────
function SettingsTab() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword.length < 6) {
      setMessage({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 6 caractères." });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Mot de passe mis à jour avec succès." });
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.error || "Une erreur est survenue." });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur réseau. Veuillez réessayer." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-8">Paramètres</h1>

      <div className="max-w-md">
        {/* Admin Email Info */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500">Email administrateur</p>
              <p className="text-sm text-neutral-300">{session?.user?.email || "—"}</p>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-5">Changer le mot de passe</h2>

          {message && (
            <div
              className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-neutral-500 block mb-1.5">Mot de passe actuel</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-500 block mb-1.5">Nouveau mot de passe</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-500 block mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 text-sm text-neutral-900 bg-white rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Mettre à jour"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────
export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const activeTab =
    tab === "products" ? "products" :
    tab === "hero" ? "hero" :
    tab === "analytics" ? "analytics" :
    tab === "settings" ? "settings" :
    "dashboard";

  return (
    <AdminShell activeTab={activeTab}>
      {activeTab === "dashboard" && <DashboardTab />}
      {activeTab === "products" && <ProductsTab />}
      {activeTab === "hero" && <HeroTab />}
      {activeTab === "analytics" && <AnalyticsTab />}
      {activeTab === "settings" && <SettingsTab />}
    </AdminShell>
  );
}
