"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Chat from "@/components/section/Chat";
import { Go, PlayPause } from "@/components/ui/DomeButtons";
import { Dithering } from "@paper-design/shaders-react";
import ProtectedRoute from "@/components/section/ProtectedRoute";

type ChatItem = {
  user: { mess: string };
  bot: { mess: string; link?: string; zip?: string };
};

const Page = () => {
  const [started, setStarted] = useState(false);
  const [Chats, setChats] = useState<ChatItem[]>([]);
  const [currentTurn, setCurrentTurn] = useState<ChatItem | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const [isListening, setIsListening] = useState(false);

  const amplitudeRaw = useMotionValue(0);
  const amplitudeSpring = useSpring(amplitudeRaw, {
    stiffness: 120,
    damping: 22,
  });
  const blurPx = useTransform(amplitudeSpring, (v) => Math.min(80, v));
  const blurFilter = useTransform(blurPx, (v) => `blur(${v * 3 + 30}px)`);

  useEffect(() => {
    const url =
      (process.env.NEXT_PUBLIC_WSS_URL as string) ||
      "https://hey-sanka-wss.onrender.com";
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log("WS open", url);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.transcript) {
          if (!currentTurn) {
            setCurrentTurn({
              user: { mess: data.transcript },
              bot: { mess: "" },
            });
          } else {
            setCurrentTurn({ ...currentTurn, user: { mess: data.transcript } });
          }
        }

        if (data.final) {
          const finalizedTurn: ChatItem = {
            user: { mess: data.final },
            bot: {
              mess: `done nakul, I generated a TODO app for you based on: "${data.final.slice(
                0,
                120
              )}"`,
            },
          };
          setChats((prev) => [...prev, finalizedTurn]);
          setCurrentTurn(null);

          handleGenerateAndSendTTS(data.final);
        }

        if (data.audio) playAudio(data.audio);
        if (data.error) console.error("Server error:", data);
      } catch (err) {
        console.warn("Invalid WS message", event.data);
      }
    };

    ws.onerror = (e) => console.error("WS error", e);
    return () => ws.close();
  }, []);

  const playAudio = (base64: string) => {
    const audioData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob = new Blob([audioData], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);
    new Audio(url).play();
  };

  const handleGenerateAndSendTTS = async (prompt: string) => {
    if (!wsRef.current) return;
    try {
      const generatedText = `done nakul, I generated a TODO app for you based on: "${prompt.slice(
        0,
        120
      )}"`;
      wsRef.current.send(JSON.stringify({ event: "tts", text: generatedText }));
    } catch (err) {
      console.error("generate error", err);
    }
  };

  const startMic = async () => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ event: "start" }));
    setIsListening(true);
    setStarted(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    source.connect(processor);
    processor.connect(audioCtx.destination);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);

      // RMS calculation
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) sum += inputData[i] ** 2;
      const rms = Math.sqrt(sum / inputData.length);

      amplitudeRaw.set(rms * 200);

      const buffer = new ArrayBuffer(inputData.length * 2);
      const view = new DataView(buffer);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
      wsRef.current?.send(
        JSON.stringify({
          event: "audio",
          audio: Array.from(new Uint8Array(buffer)),
        })
      );
    };
  };

  const stopMic = () => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ event: "stop" }));
    setIsListening(false);

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-screen bg-[conic-gradient(at_center,_#c6750c,_#beae60,_#d7cbc6,_#c6750c,_#beae60,_#d7cbc6,_#c6750c,_#beae60,_#d7cbc6,#c6750c)]">
        <motion.div
          className="w-full h-full bg-black rounded-4xl absolute inset-0 z-30"
          style={{
            filter: blurFilter,
          }}
        >
          <Dithering
            className="h-full w-full"
            colorBack="#000000"
            colorFront="#101010"
            shape="simplex"
            type="4x4"
            pxSize={2}
            speed={1}
            scale={0.6}
          />
        </motion.div>

        <div className="w-full h-full flex flex-col justify-center items-center absolute inset-0 z-40">
          <Go started={started} startMic={startMic} />
          <PlayPause
            started={started}
            isListening={isListening}
            stopMic={stopMic}
            startMic={startMic}
          />
          <Chat Chats={currentTurn ? [...Chats, currentTurn] : Chats} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
