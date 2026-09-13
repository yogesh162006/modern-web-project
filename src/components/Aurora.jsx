import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;
uniform vec2 uMouse;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  // Responsive wave interaction with subtle mouse and scroll offset
  vec2 noiseCoord = vec2(
    uv.x * 2.2 + uTime * 0.07 + uMouse.x * 0.12, 
    uTime * 0.18 + uMouse.y * 0.1
  );
  
  float height = snoise(noiseCoord) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.65 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`;

export default function Aurora({
  colorStops = ['#27ff4b', '#ffffff', '#17d723'],
  amplitude = 0.6,
  blend = 0.8,
  speed = 1.0,
  lightMode = false,
  hoverBoost = false
}) {
  const ctnDom = useRef(null);
  const propsRef = useRef({ colorStops, amplitude, blend, speed, lightMode, hoverBoost });
  propsRef.current = { colorStops, amplitude, blend, speed, lightMode, hoverBoost };

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    // High performance WebGL setup
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';

    let program;

    let cachedRect = null;
    function updateRect() {
      if (ctn) cachedRect = ctn.getBoundingClientRect();
    }

    function resize() {
      if (!ctn) return;
      updateRect();
      const width = ctn.offsetWidth || window.innerWidth || 1080;
      const height = ctn.offsetHeight || window.innerHeight || 800;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.dpr = dpr;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width * dpr, height * dpr];
      }
    }
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth || 1080, ctn.offsetHeight || 800] },
        uBlend: { value: blend },
        uLightMode: { value: lightMode ? 1 : 0 },
        uMouse: { value: [0, 0] }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    // Subtle interaction state tracking without React re-renders
    const mouseState = {
      targetX: 0,
      targetY: 0,
      currX: 0,
      currY: 0,
      scrollImpulse: 0,
      currAmplitude: amplitude
    };

    const handlePointerEnter = () => {
      updateRect();
    };

    const handlePointerMove = (e) => {
      if (!cachedRect) updateRect();
      if (!cachedRect || cachedRect.width === 0 || cachedRect.height === 0) return;
      const x = ((e.clientX - cachedRect.left) / cachedRect.width - 0.5) * 2.0;
      const y = ((e.clientY - cachedRect.top) / cachedRect.height - 0.5) * 2.0;
      mouseState.targetX = Math.max(-1, Math.min(1, x));
      mouseState.targetY = Math.max(-1, Math.min(1, y));
    };

    const handlePointerLeave = () => {
      mouseState.targetX = 0;
      mouseState.targetY = 0;
    };

    ctn.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    ctn.addEventListener('pointermove', handlePointerMove, { passive: true });
    ctn.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) updateRect();
      },
      { threshold: 0.05 }
    );
    observer.observe(ctn);

    let animateId = 0;
    let accumulatedTime = 0;
    let lastTimestamp = performance.now();

    const update = (now) => {
      animateId = requestAnimationFrame(update);
      if (!isVisible) return;

      const deltaMs = Math.min(now - lastTimestamp, 50);
      lastTimestamp = now;

      // Smooth interaction lerp (60Hz / 120Hz / 144Hz adaptive)
      mouseState.currX += (mouseState.targetX - mouseState.currX) * 0.04;
      mouseState.currY += (mouseState.targetY - mouseState.currY) * 0.04;
      mouseState.scrollImpulse *= 0.94; // Fade scroll impulse

      // Hover atmospheric boost interpolation
      const baseAmp = propsRef.current.amplitude ?? 0.6;
      const targetAmp = propsRef.current.hoverBoost ? (baseAmp + 0.12) : baseAmp;
      mouseState.currAmplitude += (targetAmp - mouseState.currAmplitude) * 0.05;

      const baseSpeed = propsRef.current.speed ?? 1.0;
      const targetSpeed = propsRef.current.hoverBoost ? (baseSpeed * 1.25) : baseSpeed;
      const currentSpeed = targetSpeed * (1.0 + Math.abs(mouseState.scrollImpulse) * 0.5);
      accumulatedTime += (deltaMs / 1000) * currentSpeed;

      program.uniforms.uTime.value = accumulatedTime;
      program.uniforms.uAmplitude.value = mouseState.currAmplitude;
      program.uniforms.uBlend.value = propsRef.current.blend ?? 0.8;
      program.uniforms.uLightMode.value = (propsRef.current.lightMode ?? lightMode) ? 1 : 0;
      program.uniforms.uMouse.value = [mouseState.currX, mouseState.currY + mouseState.scrollImpulse];

      const stops = propsRef.current.colorStops ?? colorStops;
      program.uniforms.uColorStops.value = stops.map(hex => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });

      renderer.render({ scene: mesh });
    };

    animateId = requestAnimationFrame(update);
    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (ctn) {
        ctn.removeEventListener('pointerenter', handlePointerEnter);
        ctn.removeEventListener('pointermove', handlePointerMove);
        ctn.removeEventListener('pointerleave', handlePointerLeave);
        if (gl.canvas.parentNode === ctn) {
          ctn.removeChild(gl.canvas);
        }
      }
      observer.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [amplitude, blend, lightMode]);

  return <div ref={ctnDom} className="aurora-container" style={{ width: '100%', height: '100%' }} />;
}