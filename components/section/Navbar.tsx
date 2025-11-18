import Image from "next/image";
import React from "react";
import { IoLogoGithub } from "react-icons/io";
import { BsTwitterX } from "react-icons/bs";

const Navbar = () => {
  return (
    <nav className="fixed flex w-full justify-between items-center px-10 py-5 text-neutral-300 z-50">
      <div className="flex items-center gap-3">
        <a href="/" className="cursor-pointer">
          <Image
            alt=""
            width={500}
            height={500}
            src={"/logo.svg"}
            className="size-12"
          />
        </a>
        <span>/</span>
        <p>Hey Sañka</p>
      </div>
      <div className="flex items-center gap-3">
        <a href="https://github.com/naaakul/Hey-Sanka" className="cursor-pointer">
          <IoLogoGithub size={23}/>
        </a>
        <a href="https://x.com/heynakul" className="cursor-pointer">
          <BsTwitterX size={20}/>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
