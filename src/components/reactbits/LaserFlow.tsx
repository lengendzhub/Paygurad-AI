"use client";

import React, { useEffect, useRef, useState } from "react";

export interface LaserFlowProps {
  color?: string;
  intensity?: number;
  beamWidth?: number;
  beamPosition?: number;
  flare?: number;
  spread?: number;
  spill?: number;
  fog?: number;
  dust?: number;
  streaks?: number;
  dots?: number;
  pulse?: number;
  speed?: number;
  seed?: number;
  mouseInteraction?: boolean;
  intro?: boolean;
  dpr?: number;
  theme?: "dark" | "light";
  surfaceRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function LaserFlow({
  color = "#0088cc",
  intensity = 1.6,
  beamWidth = 1.5,
  beamPosition = 0.7,
  flare = 1.5,
  spread = 1.5,
  spill = 1,
  fog = 0.2,
  dust = 1.2,
  streaks = 1.5,
  dots = 1,
  pulse = 1.2,
  speed = 1,
  seed = 3,
  mouseInteraction = true,
  intro = true,
  dpr = 1.5,
  theme = "dark",
  surfaceRef,
  className = "",
}: LaserFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasWebGL2, setHasWebGL2] = useState<boolean>(true);
  const mousePos = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Feature detect WebGL2
    const testGl = canvas.getContext("webgl2");
    if (!testGl) {
      setHasWebGL2(false);
      return;
    }

    const gl = testGl;

    // Vertex shader
    const vsSource = `#version 300 es
      in vec2 aPosition;
      out vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment shader with beam, flare, fog, dust particles, and target surface illumination
    const fsSource = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;

      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uBeamPos;
      uniform float uBeamWidth;
      uniform float uFlare;
      uniform float uFog;
      uniform float uDust;
      uniform vec2 uMouse;
      uniform vec4 uSurfaceBox; // x, y, width, height in normalized UV
      uniform float uIsDark;

      // Pseudo-random & noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;

        // Beam origin and trajectory
        float beamCenter = uBeamPos + (uMouse.x - 0.5) * 0.08;
        float distToBeam = abs(uv.x - beamCenter);

        // Core laser beam (vertical, expanding slightly downward)
        float coreWidth = (0.003 * uBeamWidth) + uv.y * 0.008 * uBeamWidth;
        float core = exp(-distToBeam / coreWidth) * 1.5;

        // Wider atmospheric halo / flare
        float haloWidth = (0.06 * uFlare) + uv.y * 0.12;
        float halo = exp(-distToBeam / haloWidth) * 0.45;

        // Vertical streaks & dust particles
        vec2 streakUv = vec2(uv.x * 40.0, uv.y * 8.0 - uTime * 0.8);
        float streaks = noise(streakUv) * exp(-distToBeam / 0.08) * uFog;

        vec2 dustUv = vec2(uv.x * 80.0, uv.y * 40.0 - uTime * 0.3);
        float dust = pow(noise(dustUv), 4.0) * uDust * exp(-distToBeam / 0.15);

        // Surface spill at target card (if surface box provided)
        float surfaceSpill = 0.0;
        if (uSurfaceBox.z > 0.0) {
          float cardTop = 1.0 - uSurfaceBox.y; // invert for GL UV
          float cardLeft = uSurfaceBox.x;
          float cardRight = cardLeft + uSurfaceBox.z;

          if (uv.x >= cardLeft - 0.05 && uv.x <= cardRight + 0.05) {
            float distToTop = abs(uv.y - cardTop);
            surfaceSpill = exp(-distToTop / 0.04) * 0.7 * exp(-abs(uv.x - beamCenter) / 0.2);
          }
        }

        // Pulse modulation
        float pulse = 0.95 + 0.08 * sin(uTime * 3.0);

        // Composite beam strength
        float totalLight = (core + halo + streaks + dust + surfaceSpill) * uIntensity * pulse;

        // Theme adjustments
        vec3 finalColor = uColor * totalLight;
        float alpha = clamp(totalLight * 0.85, 0.0, 0.95);

        fragColor = vec4(finalColor, alpha);
      }
    `;

    function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setHasWebGL2(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      setHasWebGL2(false);
      return;
    }

    // Geometry (quad)
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uRes = gl.getUniformLocation(program, "uResolution");
    const uTm = gl.getUniformLocation(program, "uTime");
    const uCol = gl.getUniformLocation(program, "uColor");
    const uInt = gl.getUniformLocation(program, "uIntensity");
    const uPos = gl.getUniformLocation(program, "uBeamPos");
    const uWid = gl.getUniformLocation(program, "uBeamWidth");
    const uFlr = gl.getUniformLocation(program, "uFlare");
    const uFg = gl.getUniformLocation(program, "uFog");
    const uDst = gl.getUniformLocation(program, "uDust");
    const uMs = gl.getUniformLocation(program, "uMouse");
    const uSrf = gl.getUniformLocation(program, "uSurfaceBox");
    const uDark = gl.getUniformLocation(program, "uIsDark");

    // Hex to RGB
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;

    gl.useProgram(program);
    gl.uniform3f(uCol, r, g, b);
    gl.uniform1f(uInt, intensity);
    gl.uniform1f(uWid, beamWidth);
    gl.uniform1f(uFlr, flare);
    gl.uniform1f(uFg, fog);
    gl.uniform1f(uDst, dust);
    gl.uniform1f(uDark, theme === "dark" ? 1.0 : 0.0);

    // Resize handler
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const currentDpr = Math.min(window.devicePixelRatio || 1, dpr);
      canvas.width = rect.width * currentDpr;
      canvas.height = rect.height * currentDpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteraction || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current.targetX = (e.clientX - rect.left) / rect.width;
      mousePos.current.targetY = (e.clientY - rect.top) / rect.height;
    };

    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) * 0.001 * speed;

      // Smooth mouse
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      // Surface bounding box calculation
      let sX = 0, sY = 0, sW = 0, sH = 0;
      if (surfaceRef?.current && canvas) {
        const cRect = canvas.getBoundingClientRect();
        const sRect = surfaceRef.current.getBoundingClientRect();
        sX = (sRect.left - cRect.left) / cRect.width;
        sY = (sRect.top - cRect.top) / cRect.height;
        sW = sRect.width / cRect.width;
        sH = sRect.height / cRect.height;
      }

      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTm, elapsed);
      gl.uniform1f(uPos, beamPosition);
      gl.uniform2f(uMs, mousePos.current.x, mousePos.current.y);
      gl.uniform4f(uSrf, sX, sY, sW, sH);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
    };
  }, [
    color,
    intensity,
    beamWidth,
    beamPosition,
    flare,
    fog,
    dust,
    speed,
    dpr,
    mouseInteraction,
    theme,
    surfaceRef,
  ]);

  // CSS Fallback when WebGL2 is not available
  if (!hasWebGL2) {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {/* Vertical glow line */}
        <div
          className="absolute top-0 w-0.5 h-full opacity-60"
          style={{
            left: `${beamPosition * 100}%`,
            background: "linear-gradient(to bottom, #0088cc 0%, rgba(0, 136, 204, 0.4) 70%, transparent 100%)",
            boxShadow: "0 0 24px 3px rgba(0, 136, 204, 0.75)",
          }}
        />
        {/* Soft radial glow */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            left: `${beamPosition * 100 - 15}%`,
            background: "#0088cc",
          }}
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

