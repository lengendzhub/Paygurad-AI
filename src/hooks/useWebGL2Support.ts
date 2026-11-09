"use client";

import { useEffect, useState } from "react";

export function useWebGL2Support(): boolean {
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

