"use client";

import React, { useState } from "react";
import Modal from "@/components/section/Modal";
import Hero from "@/components/section/Hero";
import Link from "next/link";

const Page = () => {
  const [reveal, setReveal] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden font-mono relative">
      <Modal reveal={reveal} setReveal={setReveal} />
      <Hero reveal={reveal} setReveal={setReveal} />
      <p className="text-white/45 w-full text-center text-[0.6rem] mb-4">
        Designed & Built by
        <Link href={"https://nakul.space"}>
          <span className="hover:text-white cursor-pointer">&nbsp;Nakul</span>.
          © 2025.
        </Link>
        <Link href={"/privacy-policy"}>
          <span className="hover:text-white cursor-pointer">&nbsp;Privacy Policy&nbsp;</span>
        </Link>
        | X:
        <Link href={"https://x.com/heynakul"}>
          <span className="hover:text-white cursor-pointer">&nbsp;@heynakul</span>
        </Link>
      </p>
    </div>
  );
};

export default Page;
