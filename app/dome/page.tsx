"use client";
import React, { useEffect, useRef, useState } from "react";
import SiriWave from "siriwave";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square } from "lucide-react";
import Chat from "@/components/section/Chat";

type ChatItem = {
  user: { mess: string };
  bot: { mess: string; link?: string; zip?: string };
};

const Chats: ChatItem[] = [
  {
    user: { mess: "Create me an TODO app." },
    bot: {
      mess: "created your TODO app",
      link: "https://osenfonoi3nron.sanka.pro",
      zip: "todo-app.zip",
    },
  },
];

const Page = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const siriRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [started, setStarted] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);

  const startMic = async () => {
    if (listening) return;

    setListening(true);
    setStarted(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(stream);

    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 512;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    source.connect(analyser);

    const tick = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteTimeDomainData(dataArrayRef.current as any);

      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const v = (dataArrayRef.current[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / dataArrayRef.current.length);

      setAmplitude(rms);
      if (siriRef.current) {
        siriRef.current.setAmplitude(rms * 12);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  const stopMic = () => {
    setListening(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    if (divRef.current && !siriRef.current) {
      siriRef.current = new SiriWave({
        container: divRef.current,
        width: 640,
        height: 200,
        style: "ios9",
        speed: 0.2,
        amplitude: 0.0001,
        autostart: true,
      });
    }
  }, []);

  return (
    <div className="w-full h-screen bg-neutral-950 flex flex-col justify-center items-center relative">
      <div
        className="fixed top-0 h-80 bg-[linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)] w-full flex justify-center"
        ref={divRef}
      ></div>

      <AnimatePresence>
        {!started && (
          <motion.div
            key="overlay"
            className="absolute inset-0 bg-black flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.button
              key="go-btn"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onClick={startMic}
              className="h-28 w-28 flex justify-center items-center bg-[#0b0b0b] text-white rounded-full cursor-pointer border border-neutral-800"
            >
              <p className="text-3xl font-bold">Go!</p>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {started && (
          <motion.button
            key="control-btn"
            initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(12px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={listening ? stopMic : startMic}
            className="fixed bottom-6 right-6 h-20 w-20 flex justify-center items-center bg-black text-white rounded-full cursor-pointer z-50 shadow-lg"
          >
            <AnimatePresence mode="wait" initial={false}>
              {listening ? (
                <motion.div
                  key="stop-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1}}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Square size={32} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="play-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1}}
                  exit={{ opacity: 0, scale: 0.8}}
                  transition={{ duration: 0.3 }}
                >
                  <Play size={32} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      <Chat Chats={Chats}/>
    </div>
  );
};

export default Page;
