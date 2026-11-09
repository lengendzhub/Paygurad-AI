"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useScrollRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const refresh = () => {
      ScrollTrigger.refresh();
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    // Refresh on route transition
    const timeout = setTimeout(refresh, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);
}

