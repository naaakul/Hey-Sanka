"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";

export default function ChainedPaths() {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const rafRefs = useRef<(number | null)[]>([]);
  const [showThird, setShowThird] = useState(false);
  const [fadeOutMain, setFadeOutMain] = useState(false);
  const [showMask, setShowMask] = useState(false);

  const animatePath = (
    path: SVGPathElement,
    segment = 200,
    speed = 220,
    idx = 0
  ): Promise<void> => {
    return new Promise((resolve) => {
      const L = path.getTotalLength();
      if (segment >= L) {
        path.setAttribute("stroke-dasharray", `${L} 0`);
        path.setAttribute("stroke-dashoffset", "0"); 
        return resolve();
      }

      const remaining = Math.max(0, L - segment);
      path.setAttribute("stroke-dasharray", `${segment} ${remaining}`);
      path.setAttribute("stroke-dashoffset", "0");
      path.setAttribute("stroke-linecap", "round");

      const durationMs = 2000;
      const distance = Math.max(0, L - segment);
      let start = performance.now();

      const step = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / durationMs);
        const offset = -Math.round(t * distance);
        path.setAttribute("stroke-dashoffset", String(offset));

        if (t < 1) {
          rafRefs.current[idx] = requestAnimationFrame(step);
        } else {
          path.setAttribute("stroke-dashoffset", String(-distance));
          resolve();
        }
      };

      rafRefs.current[idx] = requestAnimationFrame(step);
    });
  };

  useLayoutEffect(() => {
    // inside your useLayoutEffect
    const run = async () => {
      if (!pathRefs.current[0] || !pathRefs.current[1]) return;

      // Animate first two paths in parallel
      await Promise.all([
        animatePath(pathRefs.current[0]!, 325, 325, 0),
        animatePath(pathRefs.current[1]!, 325, 325, 1),
      ]);

      // Show third path
      setShowThird(true);
      
      // Start fade out of third and show masked gradient simultaneously
      setTimeout(() => {
        setFadeOutMain(true); // optional main fade
        setShowMask(true); // show masked gradient
        setShowThird(false); // fade out third path at same time
      }, 2000); // small delay for smoother visual
    };

    run();

    return () => {
      rafRefs.current.forEach((id) => id && cancelAnimationFrame(id));
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center">
      {/* Main animated SVG */}
      <svg
        width="1076"
        height="713"
        viewBox="0 0 1076 713"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: "visible",
          display: "block",
          opacity: fadeOutMain ? 0 : 1,
          transition: "opacity 1s ease",
          position: "absolute",
        }}
      >
        {/* Path 1 */}
        <path
          ref={(el) => (pathRefs.current[0] = el)}
          d="M80.5001 -45.5C135.333 -35.8333 234.9 13.9 188.5 97.5C130.5 202 138.5 294 225 306.5C311.5 319 362.5 253.5 354 194C345.277 132.941 234.132 53.4917 60.5001 285C-58.0001 443 24.0001 563 121.5 554C233 543.708 384.231 377.336 386 375.5C506 251 592 405 689.5 338"
          stroke="#656565"
          strokeWidth="2"
          fill="none"
        />

        {/* Path 2 */}
        <path
          ref={(el) => (pathRefs.current[1] = el)}
          d="M996 757.975C941.167 748.308 841.6 698.575 888 614.975C946 510.475 938 418.475 851.5 405.975C765 393.475 714 458.975 722.5 518.475C731.223 579.534 842.368 658.983 1016 427.475C1134.5 269.475 1052.5 149.475 955 158.475C843.5 168.767 692.269 335.139 690.5 336.975C570.5 461.475 484.5 307.475 387 374.475"
          stroke="#656565"
          strokeWidth="2"
          fill="none"
        />

        {/* Path 3 */}
        <path
          d="M470.882 326.335C497.057 322.407 521.867 327.979 546.079 335.397C570.221 342.793 593.884 352.073 617.436 355.325C638.586 358.246 659.741 356.327 681.325 343.928C653.947 370.265 628.394 382.1 604.117 385.743C577.943 389.671 553.133 384.099 528.921 376.682C504.779 369.286 481.115 360.005 457.564 356.753C436.414 353.833 415.258 355.75 393.674 368.15C421.052 341.813 446.606 329.978 470.882 326.335Z"
          fill="#656565"
          stroke="#656565"
          strokeWidth="2"
          style={{
            opacity: showThird ? 1 : 0,
            transition: "opacity 1s ease", // <-- this gives smooth fade
            position: "absolute",
            zIndex: "10",
          }}
        />
      </svg>

      {/* Final Masked Gradient */}
      {showMask && (
        <div
          className="absolute"
          style={{
            opacity: showMask ? 1 : 0,
            transition: "opacity 1s ease", // <-- smooth fade in
            zIndex: "1",
          }}
        >
          <svg
            width="1076"
            height="713"
            viewBox="0 0 1076 713"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="grainMask">
                <path 
          strokeWidth="2"
                 d="M470.882 326.335C497.057 322.407 521.867 327.979 546.079 335.397C570.221 342.793 593.884 352.073 617.436 355.325C638.586 358.246 659.741 356.327 681.325 343.928C653.947 370.265 628.394 382.1 604.117 385.743C577.943 389.671 553.133 384.099 528.921 376.682C504.779 369.286 481.115 360.005 457.564 356.753C436.414 353.833 415.258 355.75 393.674 368.15C421.052 341.813 446.606 329.978 470.882 326.335Z" />
              </clipPath>
            </defs>
            <foreignObject
              width="100%"
              height="100%"
              clipPath="url(#grainMask)"
            >
              <GrainGradient
                style={{ height: "100%", width: "100%" }}
                colors={["#7300ff", "#eba8ff", "#00bfff", "#2b00ff"]}
                colorBack="#190038"
                softness={0}
                intensity={0.5}
                noise={0.24}
                shape="corners"
                offsetX={0.01}
                offsetY={0}
                scale={0.3}
                rotation={32}
                speed={2}
              />
            </foreignObject>
          </svg>
        </div>
      )}
    </div>
  );
}
