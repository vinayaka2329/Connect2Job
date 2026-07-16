import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ value, animateOnValueChange = true, ready = true }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  const prevValueRef = useRef(value);

  // Safe parsing of mixed values (e.g. "10K+", "500+", "95%")
  const parseValue = (val) => {
    if (typeof val === 'number') {
      return { target: val, prefix: '', suffix: '' };
    }
    const str = String(val).trim();
    // Match optional non-digit prefix (like ₹), digits (possibly float), and suffix (like K+, M+, %, +)
    const match = str.match(/^([^\d.,]*)([\d.,]+)([^\d.,]*)$/);
    if (!match) {
      // Fallback: try parsing float from string directly
      const num = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
      return { target: num, prefix: '', suffix: '' };
    }
    const prefix = match[1] || '';
    const numStr = match[2].replace(/,/g, ''); // strip commas
    const suffix = match[3] || '';
    const target = parseFloat(numStr) || 0;
    return { target, prefix, suffix };
  };

  useEffect(() => {
    if (prevValueRef.current !== value) {
      const { target } = parseValue(value);

      if (hasAnimated && !animateOnValueChange) {
        setCount(target);
        prevValueRef.current = value;
        return;
      }

      setHasAnimated(false);
      prevValueRef.current = value;
    }
  }, [value, hasAnimated, animateOnValueChange]);

  useEffect(() => {
    if (!ready) return;

    const { target } = parseValue(value);

    // Reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(target);
      setHasAnimated(true);
      return;
    }

    if (hasAnimated) {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();

          const duration = 1800; // ~1.8s
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing: easeOutQuad
            const easeProgress = progress * (2 - progress);
            const currentVal = easeProgress * target;

            if (target % 1 === 0) {
              setCount(Math.floor(currentVal));
            } else {
              setCount(parseFloat(currentVal.toFixed(1)));
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated, ready]);

  const { prefix, suffix } = parseValue(value);
  const formattedVal = count.toLocaleString();

  return (
    <span ref={elementRef}>
      {prefix}{formattedVal}{suffix}
    </span>
  );
}
