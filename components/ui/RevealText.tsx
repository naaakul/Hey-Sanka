// components/RevealItem.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type RevealItemProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number; // optional delay per item for stagger effect
};

export default function RevealItem({ children, className = "", delay = 0 }: RevealItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, ease: "power2.out", duration: 0.8, delay }
    );
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
