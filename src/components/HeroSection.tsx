"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, MapPin } from "lucide-react";
import { gsap } from "gsap";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

const STATS = [
  { valueKey: "stat1_value", suffixKey: null, labelKey: "stat1_label" },
  { valueKey: "stat2_value", suffixKey: null, labelKey: "stat2_label" },
  { valueKey: "stat3_value", suffixKey: "stat3_suffix", labelKey: "stat3_label" },
] as const;

// Almost transparent glass: a faint tint and light blur so the photo stays clearly visible.
// Text on it is always light, because the photo is dark in both themes.
const GLASS = "bg-white/5 backdrop-blur-[3px] border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.25)]";

export default function HeroSection() {
  const t = useTranslations("hero");

  const cardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(cardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(statsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden py-12 sm:py-16 lg:py-24 lg:min-h-[44rem] flex items-center"
    >
      {/* `isolate` makes the section its own stacking context, so the opaque photo paints
          above the page-wide threads (HomeThreads, -z-10) and hides them until it scrolls away */}
      <div className="absolute inset-0 -z-10 bg-[#071426]">
        <Image
          src="/hero_2.jpg"
          alt={t("image_alt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#071426]/55 via-[#071426]/15 to-transparent rtl:bg-linear-to-l" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        {/* Glass card with the hero copy */}
        <div
          ref={cardRef}
          style={{ opacity: 0 }}
          className={`${GLASS} rounded-3xl p-7 sm:p-10 lg:p-12 max-w-3xl`}
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-sm font-semibold text-link tracking-wide">{t("tagline")}</span>
          </div> */}

          <h1 className="font-extrabold text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.5)]">{t("headline")}</h1>

          <p className="mt-6 text-white/90 text-base sm:text-lg leading-relaxed drop-shadow-[0_1px_8px_rgb(0_0_0/0.5)]">
            {t("subheadline")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="rcs-button rcs-button-primary group rounded-full px-7">
              <span>{t("cta_primary")}</span>
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link href="/what-we-offer" className="rcs-button rcs-button-secondary rounded-full px-7">
              {t("cta_secondary")}
            </Link>
          </div>
        </div>

        {/* Stats and location, also on glass */}
        <div
          ref={statsRef}
          style={{ opacity: 0 }}
          className="mt-6 lg:mt-8 flex flex-col lg:flex-row lg:items-stretch gap-4"
        >
          <div
            className={`${GLASS} flex-1 rounded-2xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/15`}
          >
            {STATS.map(({ valueKey, suffixKey, labelKey }) => (
              <div key={valueKey} className="px-6 py-5">
                <p className="font-display text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                  {t(valueKey)}
                  {suffixKey && <span className="ms-1.5 text-lg font-bold text-spectrum-cyan">{t(suffixKey)}</span>}
                </p>
                <p className="mt-0.5 text-sm text-white/85">{t(labelKey)}</p>
              </div>
            ))}
          </div>

          <div
            className={`${GLASS} rounded-2xl px-5 py-4 flex items-center gap-3 lg:self-end animate-[floatSlow_6s_ease-in-out_infinite]`}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
            </span>
            <MapPin className="w-4 h-4 text-spectrum-cyan shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-white">{t("image_caption")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
