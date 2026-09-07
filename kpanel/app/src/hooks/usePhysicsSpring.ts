import { useEffect, useRef, useCallback, CSSProperties } from 'react';

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const springs = {
  bouncy: { stiffness: 400, damping: 15, mass: 1 },
  smooth: { stiffness: 200, damping: 20, mass: 1 },
  micro: { stiffness: 500, damping: 25, mass: 1 },
};

export function useSpringStyle(
  targetValue: number,
  property: keyof CSSStyleDeclaration | string,
  transformTemplate: (val: number) => string,
  config: SpringConfig = springs.smooth
) {
  const ref = useRef<any>(null);
  const velocityRef = useRef(0);
  const valueRef = useRef(targetValue);
  const targetRef = useRef(targetValue);
  const animFrameRef = useRef<number | undefined>(undefined);

  const startAnimation = useCallback(() => {
    let lastTime = performance.now();
    
    const tick = (time: number) => {
      if (!ref.current) return;
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      const dt = Math.min(delta, 0.064); // max 64ms per frame to avoid huge jumps

      const displacement = targetRef.current - valueRef.current;
      const springForce = displacement * config.stiffness;
      const dampingForce = -velocityRef.current * config.damping;
      const force = springForce + dampingForce;
      const acceleration = force / config.mass;

      velocityRef.current += acceleration * dt;
      valueRef.current += velocityRef.current * dt;

      ref.current.style[property as any] = transformTemplate(valueRef.current);

      if (Math.abs(velocityRef.current) < 0.001 && Math.abs(displacement) < 0.001) {
        ref.current.style[property as any] = transformTemplate(targetRef.current);
        valueRef.current = targetRef.current;
        velocityRef.current = 0;
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(tick);
  }, [config.stiffness, config.damping, config.mass, property, transformTemplate]);

  useEffect(() => {
    if (targetRef.current !== targetValue) {
      targetRef.current = targetValue;
      startAnimation();
    }
  }, [targetValue, startAnimation]);

  return ref;
}
