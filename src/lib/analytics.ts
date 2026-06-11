// Lightweight analytics tracker — sends events to /api/analytics
// Used client-side to track page views, product views, WhatsApp clicks, etc.

export type AnalyticsEventType =
  | "page_view"
  | "product_view"
  | "whatsapp_click"
  | "cart_add"
  | "repair_click";

export async function trackEvent(
  type: AnalyticsEventType,
  data?: { page?: string; productId?: string; metadata?: Record<string, string> }
) {
  try {
    // Use sendBeacon for reliability (doesn't block navigation)
    const payload = JSON.stringify({ type, ...data });
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      // Fallback for browsers without sendBeacon
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics should never break the user experience
  }
}

// Track a page view — call once per page
export function trackPageView(page: string) {
  trackEvent("page_view", { page });
}

// Track a product view
export function trackProductView(productId: string, title: string) {
  trackEvent("product_view", { productId, metadata: { title } });
}

// Track a WhatsApp click
export function trackWhatsappClick(productId?: string, title?: string) {
  trackEvent("whatsapp_click", { productId, metadata: title ? { title } : undefined });
}

// Track add to cart
export function trackCartAdd(productId: string, title: string) {
  trackEvent("cart_add", { productId, metadata: { title } });
}

// Track repair click
export function trackRepairClick() {
  trackEvent("repair_click");
}
