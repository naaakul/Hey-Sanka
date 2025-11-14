"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { DownloadIcon } from "../ui/download-icon";
import { Arrow } from "../ui/Arrow";

type ChatItem = {
  user: { mess: string };
  bot: { mess: string; link?: string; zip?: string };
};

const b64toBlob = (b64Data: string, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

const Chat = ({ Chats }: { Chats: ChatItem[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handleDownload = (zipBase64: string) => {
    const blob = b64toBlob(zipBase64, "application/zip");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-app.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Smooth scroll whenever chats update
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [Chats]);

  return (
    <div className="h-screen w-[60rem] mx-auto flex flex-col text-neutral-300">
      <motion.div
        ref={scrollRef}
        animate={controls}
        className="flex-1 flex flex-col gap-4 p-4 py-80 overflow-y-auto hide-scrollbar"
      >
        {Chats.map((chat, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <p className="self-start max-w-[70%] py-1 rounded">
              {chat.user.mess}
            </p>

            <p className="self-end max-w-[70%] py-1 rounded">{chat.bot.mess}</p>

            {chat.bot.zip && (
              <button
                onClick={() => handleDownload(chat.bot.zip!)}
                className="px-3 py-2 text-sm w-fit flex gap-1 justify-center items-center cursor-pointer self-end bg-orange-900/35 rounded-lg hover:bg-orange-900/40 border border-orange-900 transition-colors"
              >
                Download ZIP <DownloadIcon />
              </button>
            )}

            {chat.bot.link && (
              <a
                href={chat.bot.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleDownload(chat.bot.zip!)}
                className="py-1 text-md flex gap-1 justify-center items-center cursor-pointer self-end hover:text-orange-700/40 text-orange-500 transition-colors"
              >
                {chat.bot.link}
                <Arrow className="-rotate-45 pt-1" size={17} />
              </a>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Chat;
