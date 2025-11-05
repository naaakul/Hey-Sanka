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
  const [currentTurn, setCurrentTurn] = useState<{ mess: string } | null>(null);
  const [isListening, setIsListening] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const mcpWsRef = useRef<WebSocket | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const amplitudeRaw = useMotionValue(0);
  const amplitudeSpring = useSpring(amplitudeRaw, { stiffness: 120, damping: 22 });
  const blurPx = useTransform(amplitudeSpring, (v) => Math.min(80, v));
  const blurFilter = useTransform(blurPx, (v) => `blur(${v * 3 + 30}px)`);

  useEffect(() => {
    const speechUrl = process.env.NEXT_PUBLIC_WSS_URL || "ws://localhost:8080";
    const mcpUrl = process.env.NEXT_PUBLIC_MCP_WSS_URL || "ws://localhost:8081";

    const ws = new WebSocket(speechUrl);
    const mcp = new WebSocket(mcpUrl);

    wsRef.current = ws;
    mcpWsRef.current = mcp;

    ws.onopen = () => console.log("Speech WS connected");
    mcp.onopen = () => console.log("MCP WS connected");

    // ───── SPEECH WS ─────
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.transcript) setCurrentTurn({ mess: data.transcript });

        if (data.final) {
          const userMess = data.final.trim();
          if (!userMess) return;

          setChats((prev) => [...prev, { user: { mess: userMess }, bot: { mess: "" } }]);
          handleSendToMCP(userMess);
          setCurrentTurn(null);
        }

        if (data.audio) playAudio(data.audio);
        if (data.error) console.error("Speech WS error:", data);
      } catch (err) {
        console.warn("Invalid WS1 message", event.data);
      }
    };

    // ───── MCP WS ─────
    mcp.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.bot) {
          const botMess = data.bot.mess;

          setChats((prev) => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              bot: {
                ...updated[updated.length - 1].bot,
                mess: botMess,
                ...data.bot,
              },
            };
            return updated;
          });

          handleGenerateAndSendTTS(botMess);
        }
      } catch (err) {
        console.error("Invalid MCP WS message:", event.data);
      }
    };

    ws.onerror = (e) => console.error("Speech WS error", e);
    mcp.onerror = (e) => console.error("MCP WS error", e);

    return () => {
      ws.close();
      mcp.close();
    };
  }, []);

  // ───── HELPERS ─────
  const handleSendToMCP = (finalTranscript: string) => {
    if (!mcpWsRef.current || mcpWsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("MCP WS not ready");
      return;
    }

    const gitToken = localStorage.getItem("github_token") || "";
    const vercelToken = localStorage.getItem("vercel_token") || "";

    const payload = {
      command: finalTranscript,
      github_token: gitToken,
      vercel_token: vercelToken,
    };

    mcpWsRef.current.send(JSON.stringify(payload));
    console.log("send -> ", JSON.stringify(payload));
  };

  const handleGenerateAndSendTTS = (text: string) => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ event: "tts", text }));
  };

  const playAudio = (base64: string) => {
    const audioData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob = new Blob([audioData], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);
    new Audio(url).play();
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
      wsRef.current?.send(JSON.stringify({ event: "audio", audio: Array.from(new Uint8Array(buffer)) }));
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
          style={{ filter: blurFilter }}
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
          <PlayPause started={started} isListening={isListening} stopMic={stopMic} startMic={startMic} />
          <Chat Chats={currentTurn ? [...Chats, { user: { mess: currentTurn.mess }, bot: { mess: "..." } }] : Chats} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
