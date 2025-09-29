"use client";
import React, { useEffect, useRef, useState } from "react";
import SiriWave from "siriwave";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square } from "lucide-react";
import Chat from "@/components/section/Chat";
import ProtectedRoute from "@/components/section/ProtectedRoute";

type ChatItem = {
  user: { mess: string };
  bot: { mess: string; link?: string; zip?: string };
};

const Page = () => {
  const divRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line
  const siriRef = useRef<any>(null);
  const [started, setStarted] = useState(false);
  // const [amplitude, setAmplitude] = useState(0);
  const [Chats, setChats] = useState<ChatItem[]>([]);
  const [currentTurn, setCurrentTurn] = useState<ChatItem | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const [isListening, setIsListening] = useState(false);
  // const [transcript, setTranscript] = useState("");
  // const [finalTranscript, setFinalTranscript] = useState("");
  // const [isGenerating, setIsGenerating] = useState(false);

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
          // setTranscript(data.transcript);
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
          // setFinalTranscript(finalizedTurn.bot.mess);

          handleGenerateAndSendTTS(data.final);
        }

        if (data.audio) {
          console.log("audio got!");
          playAudio(data.audio);
        }

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
    const audio = new Audio(url);
    audio.play();
  };

  const handleGenerateAndSendTTS = async (prompt: string) => {
    if (!wsRef.current) return;
    try {
      // setIsGenerating(true);
      const generatedText = `done nakul, I generated a TODO app for you based on: "${prompt.slice(
        0,
        120
      )}"`;
      wsRef.current.send(JSON.stringify({ event: "tts", text: generatedText }));
      // setIsGenerating(false);
    } catch (err) {
      // setIsGenerating(false);
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
      const buffer = new ArrayBuffer(inputData.length * 2);
      const view = new DataView(buffer);

      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        sum += s * s;
      }
      const rms = Math.sqrt(sum / inputData.length);
      // setAmplitude(rms);
      if (siriRef.current) siriRef.current.setAmplitude(rms * 12);

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
              onClick={isListening ? stopMic : startMic}
              className="fixed bottom-6 right-6 h-20 w-20 flex justify-center items-center bg-black text-white rounded-full cursor-pointer z-50 shadow-lg"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isListening ? (
                  <motion.div
                    key="stop-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Square size={32} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Play size={32} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>

        <Chat Chats={currentTurn ? [...Chats, currentTurn] : Chats} />
      </div>
    </ProtectedRoute>
  );
};

export default Page;
