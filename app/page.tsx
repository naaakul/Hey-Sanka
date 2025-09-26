"use client";

import React, { useState } from "react";
import Modal from "@/components/section/Modal";
import Hero from "@/components/section/Hero";
import Link from "next/link";
import { Dithering } from "@paper-design/shaders-react";

const Page = () => {
  const [reveal, setReveal] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Dithering
          className="h-full w-full"
          // width={typeof window !== "undefined" ? window.innerWidth : 1280}
          // height={typeof window !== "undefined" ? window.innerHeight : 720}
          colorBack="#000000"
          colorFront="#151515"
          shape="simplex"
          type="4x4"
          pxSize={2}
          speed={1}
          scale={0.6}
        />
      </div>
      <p className="absolute top-1/2 left-[48.58%] -translate-x-1/2 -translate-y-1/2 text-[#ffffff09] text-[43rem] instrument-serif">
        Sanka
      </p>
      <div className="h-screen w-full flex flex-col overflow-hidden font-mono relative">
        <Modal reveal={reveal} setReveal={setReveal} />
        <Hero reveal={reveal} setReveal={setReveal} />
        <p className="text-white/45 w-full text-center text-[0.6rem] mb-4">
          Designed & Built by
          <Link href={"https://nakul.space"}>
            <span className="hover:text-white cursor-pointer">&nbsp;Nakul</span>
            . © 2025.
          </Link>
          <Link href={"/privacy-policy"}>
            <span className="hover:text-white cursor-pointer">
              &nbsp;Privacy Policy&nbsp;
            </span>
          </Link>
          | X:
          <Link href={"https://x.com/heynakul"}>
            <span className="hover:text-white cursor-pointer">
              &nbsp;@heynakul
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
