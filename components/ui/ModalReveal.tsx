"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function TiltLeftToRightReveal() {
  const [reveal, setReveal] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-6"
      style={{ perspective: 2200 }} // critical for 3D depth
    >
      <motion.div
        initial={{ rotateY: -35, opacity: 0, filter: "blur(20px)" }} // left side tilted
        animate={
          reveal
            ? { rotateY: 0, opacity: 1, filter: "blur(0px)" } // reveal fully upright
            : { rotateY: -35, opacity: 0, filter: "blur(20px)" }
        }
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-blue-500 text-white px-10 py-5 rounded-lg shadow-lg text-xl transform-gpu origin-left"
      >
        Tilt Left → Right 3D Reveal
      </motion.div>

      <button
        onClick={() => setReveal(!reveal)}
        className="px-6 py-2 bg-green-500 rounded text-white font-semibold"
      >
        {reveal ? "Hide" : "Reveal"}
      </button>
    </div>
  );
}
