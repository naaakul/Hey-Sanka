"use client";
import React, { useEffect, useRef, useState } from "react";
import SiriWave from "siriwave";

const Page = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const siriRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);

  const startMic = async () => {
    if (listening) {
      setListening(false);
      return;
    }
    setListening(true);

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
        // map rms (0–1) to SiriWave’s amplitude range (0–1+)
        siriRef.current.setAmplitude(rms * 12);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  useEffect(() => {
    if (divRef.current && !siriRef.current) {
      siriRef.current = new SiriWave({
        container: divRef.current,
        width: 640,
        height: 200,
        style: "ios9",
        speed: 0.2,
        amplitude: 0.001,
        autostart: true,
      });
    }
  }, []);

  return (
    <div className="w-full h-screen bg-white flex flex-col justify-center items-center space-y-4">
      <div
        className="fixed top-0 h-80 bg-[linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)] w-full flex justify-center"
        ref={divRef}
      ></div>
      <button
        onClick={startMic}
        className="h-24 w-24 flex justify-center items-center bg-white text-black rounded-full cursor-pointer z-50"
      >
        <p className="text-3xl font-bold">Go!</p>
      </button>
      
    </div>
  );
};

export default Page;
