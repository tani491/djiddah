"use client";

import { motion } from "framer-motion";
import { Wrench, ShieldCheck, Clock, ArrowRight, Smartphone } from "lucide-react";
import { trackRepairClick } from "@/lib/analytics";

// WhatsApp icon SVG — white phone inside the green bubble, matching the official logo
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor">
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.054 9.378L1.056 31.2l6.072-1.952c2.52 1.68 5.52 2.656 8.748 2.656h.008C24.826 31.904 32 24.728 32 16.004S24.826 0 16.004 0zm9.314 22.61c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.322-5.67-1.218-4.762-1.97-7.826-6.81-8.064-7.126-.23-.316-1.932-2.574-1.932-4.908s1.222-3.482 1.654-3.96c.432-.478.942-.598 1.256-.598.314 0 .63.002.906.016.29.016.682-.112 1.066.814.39.942 1.326 3.246 1.442 3.482.116.236.194.514.04.828-.156.316-.234.514-.47.792-.236.278-.496.62-.708.832-.236.236-.482.49-.206.962.274.47 1.222 2.016 2.624 3.266 1.804 1.608 3.324 2.106 3.796 2.342.472.236.748.196 1.022-.118.278-.316 1.182-1.378 1.498-1.854.314-.478.63-.394 1.064-.236.432.156 2.778 1.31 3.25 1.548.472.236.79.354.906.548.118.196.118 1.12-.272 2.218z" />
    </svg>
  );
}

const REPAIR_WHATSAPP_URL =
  "https://wa.me/221781131340?text=Bonjour%20Djidah%20Electrique%2C%20j%27aimerais%20demander%20une%20r%C3%A9paration%20de%20t%C3%A9l%C3%A9phone.%20Pouvez-vous%20me%20donner%20plus%20d%27informations%20sur%20vos%20services%20de%20r%C3%A9paration%20%3F";

const repairs = [
  {
    icon: Smartphone,
    title: "Écran cassé",
    description: "Remplacement d'écran pour iPhone et Android, pièces de qualité originale.",
  },
  {
    icon: ShieldCheck,
    title: "Batterie & Composants",
    description: "Changement de batterie, connecteur de charge, caméra, bouton home.",
  },
  {
    icon: Clock,
    title: "Réparation rapide",
    description: "La plupart des réparations effectuées en moins de 2 heures sur place.",
  },
];

export default function RepairSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-neutral-950">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Red glow accent top-right */}
      <div
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(227,6,19,0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E30613]/10 border border-[#E30613]/20 rounded-full mb-6">
              <Wrench className="w-3.5 h-3.5 text-[#E30613]" />
              <span className="text-xs font-semibold tracking-wider text-[#E30613] uppercase">
                Service Réparation
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Téléphone en panne ?
              <br />
              <span className="text-neutral-400">On le répare.</span>
            </h2>

            <p className="mt-5 text-neutral-400 leading-relaxed max-w-md">
              Écran cassé, batterie faible, problème de charge... Nos techniciens
              qualifiés réparent votre téléphone rapidement et à prix compétitif.
              Toutes marques : iPhone, Samsung, Huawei, et plus.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <a
                href={REPAIR_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackRepairClick()}
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-[#25D366] text-white text-sm font-semibold rounded-full hover:bg-[#20BD5A] transition-all duration-300 shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/35 hover:scale-[1.02]"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Demander une réparation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </a>
              <a
                href={REPAIR_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 border-2 border-neutral-700 text-neutral-300 text-sm font-semibold rounded-full hover:border-neutral-500 hover:text-white transition-all duration-300"
              >
                <Wrench className="w-4 h-4" />
                Voir les tarifs
              </a>
            </div>
          </motion.div>

          {/* Right: Repair cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-4"
          >
            {repairs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-start gap-5 hover:border-neutral-700 transition-colors duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#E30613]/10 rounded-xl flex items-center justify-center group-hover:bg-[#E30613]/20 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-[#E30613]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Bottom trust badge */}
            <div className="mt-6 flex items-center gap-3 px-2">
              <div className="flex -space-x-2">
                {["bg-blue-500", "bg-green-500", "bg-orange-500"].map((c, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 ${c} rounded-full border-2 border-neutral-950 flex items-center justify-center`}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {["S", "A", "M"][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm text-neutral-300 font-medium">
                  +500 réparations
                </p>
                <p className="text-xs text-neutral-600">
                  Clients satisfaits à Dakar
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
