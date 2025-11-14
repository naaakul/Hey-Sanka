"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { useRouter } from "next/navigation";

interface gitToken {
  valid: boolean;
  missingScopes: string[];
  scope?: string[];
}

interface vercelToken {
  valid: boolean;
  missingScopes: string[];
}

const Modal = ({
  reveal,
  setReveal,
}: {
  reveal: boolean;
  setReveal: (value: boolean) => void;
}) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [gitToken, setGitToken] = useState<string | null>(null);
  const [vercelToken, setVercelToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [gitChecking, setGitChecking] = useState<boolean>(false);
  const [vercelChecking, setVercelChecking] = useState<boolean>(false);
  const [gitResult, setGitResult] = useState<gitToken | null>(null);
  const [vercelResult, setVercelResult] = useState<vercelToken | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setStep(1);
  }, [reveal]);

  useEffect(() => {
    // eslint-disable-next-line
    const handler = (e: any) => {
      if (e.key === "Enter") {
        e.preventDefault();
        nextBtnRef.current?.click();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  async function checkTokens() {
    // setLoading(true);
    setGitChecking(true);
    setVercelChecking(true);
    setGitResult(null);
    setVercelResult(null);

    try {
      let ghData, vcData;
      if (!gitResult?.valid) {
        const ghRes = await fetch("/api/check-github-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: gitToken }),
        });
        ghData = await ghRes.json();
        if (ghData?.valid) setGitChecking(false);
        setGitResult(ghData);
      }

      if (!vercelResult?.valid) {
        const vcRes = await fetch("/api/check-vercel-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: vercelToken }),
        });
        vcData = await vcRes.json();
        if (vcData?.valid) setVercelChecking(false);
        setVercelResult(vcData);
      }

      if (ghData?.valid && vcData?.valid) {
        localStorage.setItem("github_token", gitToken || "");
        localStorage.setItem("vercel_token", vercelToken || "");
        setLoading(true);
        router.push("/dome");
      }
    } catch (err) {
      console.error(err);
      if (!gitResult?.valid) {
        setGitResult({
          valid: false,
          missingScopes: ["GitHub request failed"],
        });
      }
      if (!vercelResult?.valid) {
        setVercelResult({
          valid: false,
          missingScopes: ["Vercel request failed"],
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (step < 3) {
      setDirection("next");
      setStep(step + 1);
    } else {
      checkTokens();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setDirection("prev");
      setStep(step - 1);
    }
  };

  const variants = {
    initial: (dir: "next" | "prev") => ({
      x: dir === "next" ? 50 : -50,
      opacity: 0,
      filter: "blur(10px)",
    }),
    animate: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir: "next" | "prev") => ({
      x: dir === "next" ? -50 : 50,
      opacity: 0,
      filter: "blur(10px)",
    }),
  };

  return (
    <AnimatePresence>
      {reveal && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-50 flex justify-center items-center bg-black/5 backdrop-blur-md"
          onClick={() => setReveal(false)}
        >
          <motion.div
            initial={{ rotateY: -35, opacity: 0, filter: "blur(20px)" }}
            animate={{ rotateY: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ rotateY: -35, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-black overflow-hidden text-white p-5 h-80 w-[30rem] rounded-lg shadow-lg transform-gpu origin-right z-[999] border border-neutral-900 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 w-full flex justify-center items-center">
              <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <div className="w-full h-full flex flex-col">
                      <p className="text-sm tracking-tight">
                        Build apps by talking
                      </p>
                      <p className="text-xs text-neutral-700 tracking-tighter">
                        Just speak your idea — Sanka will generate live code,
                        push to GitHub, and deploy to Vercel for you.
                      </p>
                      <div className="flex-1 w-full flex justify-center items-center">
                        <svg
                          width="240"
                          height="109"
                          viewBox="0 0 240 109"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <motion.linearGradient
                              gradientUnits="userSpaceOnUse"
                              id="line-one-gradient"
                              initial={{
                                x1: "0%",
                                x2: "10%",
                              }}
                              animate={{
                                x1: "90%",
                                x2: "100%",
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "linear",
                              }}
                            >
                              <stop offset="0" stopColor="var(--color-line)" />
                              <stop offset="0.33" stopColor="rgb(64, 64, 64)" />
                              <stop offset="0.66" stopColor="rgb(64, 64, 64)" />
                              <stop offset="1" stopColor="var(--color-line)" />
                            </motion.linearGradient>
                          </defs>

                          {/* <path
                            d="M17.8967 87.5835C20.5175 83.798 23.8371 74.538 16.1495 67.7823C6.54013 59.3376 1.58982 50.0194 2.02661 46.0883C2.44768 42.2986 3.27466 39.3208 6.98589 36.1113C7.24842 35.8842 7.37325 35.5397 7.3874 35.1929C7.63517 29.121 25.0805 22.7767 41.8964 25.5414C42.5943 25.6562 42.5679 26.8603 42.0072 27.2915C41.1743 27.9321 41.2844 29.8558 42.1248 30.4865C45.6705 33.1475 45.6502 35.3876 45.997 37.3524C46.4337 39.8276 46.5793 47.5442 56.3344 46.525C59.6626 46.525 55.8089 50.542 53.121 52.5657C52.7181 52.869 52.5649 53.4237 52.8664 53.828C53.8904 55.2014 55.1742 55.4871 54.296 55.9889C53.2768 56.5713 49.6369 60.5024 49.7825 61.0848C49.8906 61.5174 52.0879 62.2715 53.9867 62.6306C54.7532 62.7756 55.3145 63.7526 55.3059 64.5327C55.2698 67.8305 58.6818 72.0905 53.4945 73.5857C53.4487 73.5989 53.396 73.6096 53.3488 73.6158C42.2274 75.089 45.8536 81.1919 46.8705 87.8747"
                            stroke="url(#line-one-gradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          /> */}
                          <path
                            d="M17.8967 87.5835C20.5175 83.798 23.8371 74.538 16.1495 67.7823C6.54013 59.3376 1.58982 50.0194 2.02661 46.0883C2.44768 42.2986 3.27466 39.3208 6.98589 36.1113C7.24842 35.8842 7.37325 35.5397 7.3874 35.1929C7.63517 29.121 25.0805 22.7767 41.8964 25.5414C42.5943 25.6562 42.5679 26.8603 42.0072 27.2915C41.1743 27.9321 41.2844 29.8558 42.1248 30.4865C45.6705 33.1475 45.6502 35.3876 45.997 37.3524C46.4337 39.8276 46.5793 47.5442 56.3344 46.525C59.6626 46.525 55.8089 50.542 53.121 52.5657C52.7181 52.869 52.5649 53.4237 52.8664 53.828C53.8904 55.2014 55.1742 55.4871 54.296 55.9889C53.2768 56.5713 49.6369 60.5024 49.7825 61.0848C49.8906 61.5174 52.0879 62.2715 53.9867 62.6306C54.7532 62.7756 55.3145 63.7526 55.3059 64.5327C55.2698 67.8305 58.6818 72.0905 53.4945 73.5857C53.4487 73.5989 53.396 73.6096 53.3488 73.6158C42.2274 75.089 45.8536 81.1919 46.8705 87.8747"
                            stroke="#404040"
                            stroke-width="2"
                            stroke-linecap="round"
                          />
                          <path
                            d="M63.0317 51.621L71.7676 42.5939"
                            stroke="url(#line-one-gradient)"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          <path
                            d="M62.7407 58.0273H75.4892"
                            stroke="url(#line-one-gradient)"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          <path
                            d="M62.7407 64.4336L71.6222 73.6062"
                            stroke="url(#line-one-gradient)"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          {/* <path
                            d="M239.732 52.4356C210.607 83.3701 189.634 44.7782 166.268 61.3138C195.393 30.3793 216.366 68.9712 239.732 52.4356Z"
                            fill="url(#line-one-gradient)"
                          /> */}
                          <path
                            d="M239.732 52.4356C210.607 83.3701 189.634 44.7782 166.268 61.3138C195.393 30.3793 216.366 68.9712 239.732 52.4356Z"
                            fill="#404040"
                          />
                          <path
                            d="M62 18.8747C84.8333 3.04137 141.7 -16.7253 186.5 30.8747"
                            strokeLinecap="round"
                            stroke="url(#line-one-gradient)"
                          />
                          <path
                            d="M67 89.8747C89.8333 105.708 146.7 125.475 191.5 77.8747"
                            strokeLinecap="round"
                            stroke="url(#line-one-gradient)"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <div className="w-full h-full flex flex-col">
                      <p className="text-sm tracking-tight">
                        What you get out of the box
                      </p>
                      <p className="text-xs text-neutral-700 tracking-tighter">
                        Voice Commands – Speak to code (STT + LLM). <br />{" "}
                        Preview Sandbox – See live apps instantly in-browser.{" "}
                        <br />
                        One-Command Deploy – GitHub + Vercel pipeline done for
                        you.
                      </p>
                      <div className="flex-1 w-full flex justify-center items-center">
                        <svg
                          width="289"
                          height="113"
                          viewBox="0 0 289 113"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <motion.linearGradient
                              gradientUnits="userSpaceOnUse"
                              id="line-one-gradient"
                              initial={{
                                x1: "0%",
                                x2: "10%",
                              }}
                              animate={{
                                x1: "90%",
                                x2: "100%",
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "linear",
                              }}
                            >
                              <stop offset="0" stopColor="var(--color-line)" />
                              <stop offset="0.33" stopColor="rgb(64, 64, 64)" />
                              <stop offset="0.66" stopColor="rgb(64, 64, 64)" />
                              <stop offset="1" stopColor="var(--color-line)" />
                            </motion.linearGradient>
                          </defs>

                          <path
                            d="M21 29.5C22.6928 29.5 24.347 30.1246 25.5693 31.3281C26.765 32.5055 27.6972 34.3855 27.6973 37.1865V52.5791C27.6973 55.2643 26.7801 57.0665 25.5938 58.2021C24.3756 59.3681 22.7139 59.9844 21 59.9844C19.2861 59.9844 17.6244 59.3681 16.4062 58.2021C15.2199 57.0665 14.3027 55.2643 14.3027 52.5791V37.1865C14.3028 34.3853 15.2359 32.5055 16.4316 31.3281C17.6539 30.1248 19.3073 29.5 21 29.5Z"
                            stroke="#404040"
                            stroke-width="3"
                          />
                          <path
                            d="M21 74V86.6266"
                            stroke="#404040"
                            stroke-width="3"
                            stroke-linecap="round"
                          />
                          <path
                            d="M3 54C3 66.1352 11.7094 72.2597 20.5005 72.3734C29.4579 72.4893 38.5 66.3648 38.5 54"
                            stroke="#404040"
                            stroke-width="3"
                            stroke-linecap="round"
                          />
                          <rect
                            x="100.5"
                            y="29.5"
                            width="73"
                            height="54"
                            rx="8.5"
                            stroke="#404040"
                            stroke-width="3"
                          />
                          <line
                            x1="103"
                            y1="43.5"
                            x2="171"
                            y2="43.5"
                            stroke="#404040"
                            stroke-width="3"
                          />
                          <ellipse
                            cx="107.334"
                            cy="37.0557"
                            rx="1.66667"
                            ry="1.94444"
                            fill="#404040"
                          />
                          <ellipse
                            cx="112.667"
                            cy="37.0557"
                            rx="1.66667"
                            ry="1.94444"
                            fill="#404040"
                          />
                          <ellipse
                            cx="118"
                            cy="37.0557"
                            rx="1.66667"
                            ry="1.94444"
                            fill="#404040"
                          />
                          <path
                            d="M143.443 58.6569C145.562 60.0805 145.491 63.2815 143.231 64.5865L136.51 68.4674C134.177 69.8145 131.26 68.1304 131.26 65.4362V57.6754C131.26 54.9811 134.177 53.297 136.51 54.6442L143.231 58.524L143.443 58.6569Z"
                            stroke="#404040"
                            stroke-width="3"
                          />
                          <path
                            d="M285.364 34.3265C285.343 34.2238 285.293 34.1294 285.22 34.0542C285.147 33.9791 285.053 33.9264 284.951 33.9024C278.148 32.2385 262.432 38.1673 253.909 46.6845C252.39 48.1911 251.005 49.827 249.769 51.5736C247.142 51.3359 244.515 51.5361 242.278 52.5119C235.961 55.2893 234.123 62.543 233.61 65.6569C233.583 65.8275 233.594 66.0022 233.645 66.1675C233.696 66.3328 233.784 66.4842 233.902 66.61C234.021 66.7359 234.167 66.8327 234.329 66.893C234.491 66.9534 234.664 66.9756 234.836 66.958L244.979 65.8445C244.986 66.6095 245.032 67.3736 245.116 68.134C245.169 68.6595 245.404 69.1501 245.779 69.5214L249.707 73.4485C250.078 73.8244 250.569 74.0589 251.095 74.1115C251.851 74.1958 252.61 74.2417 253.371 74.2491L252.259 84.3827C252.241 84.5545 252.264 84.7279 252.324 84.8897C252.384 85.0514 252.481 85.1971 252.607 85.3155C252.732 85.4339 252.884 85.5218 253.049 85.5724C253.214 85.6231 253.388 85.6351 253.559 85.6075C256.674 85.1071 263.942 83.2693 266.703 76.9539C267.679 74.7145 267.879 72.1011 267.654 69.4864C269.406 68.2519 271.047 66.8668 272.557 65.3466C281.112 56.8394 287.003 41.4688 285.364 34.3265ZM264.953 54.326C264.206 53.5789 263.697 52.6271 263.491 51.5908C263.285 50.5545 263.39 49.4803 263.795 48.5041C264.199 47.5279 264.884 46.6936 265.762 46.1065C266.641 45.5195 267.674 45.2061 268.73 45.2061C269.787 45.2061 270.82 45.5195 271.698 46.1065C272.577 46.6936 273.261 47.5279 273.666 48.5041C274.07 49.4803 274.176 50.5545 273.969 51.5908C273.763 52.6271 273.254 53.5789 272.507 54.326C272.011 54.8227 271.423 55.2167 270.775 55.4855C270.127 55.7544 269.432 55.8928 268.73 55.8928C268.029 55.8928 267.334 55.7544 266.686 55.4855C266.038 55.2167 265.449 54.8227 264.953 54.326Z"
                            stroke="#404040"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M239.723 73.2135C238.476 73.3666 237.316 73.932 236.426 74.8199C234.222 77.0317 234.013 85.2237 234.013 85.2237C234.013 85.2237 242.21 85.0148 244.416 82.8079C245.307 81.9202 245.874 80.758 246.023 79.5088"
                            stroke="#404040"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M27.5 20C41.3333 5.33334 78.3 -15.2 115.5 20"
                            stroke="url(#line-one-gradient)"
                          />
                          <path
                            d="M114 93C100.167 107.667 63.2 128.2 26 93"
                            stroke="url(#line-one-gradient)"
                          />
                          <path
                            d="M245 93C231.167 107.667 194.2 128.2 157 93"
                            stroke="url(#line-one-gradient)"
                          />
                          <path
                            d="M159 19.9228C175.816 8.80044 216.493 -2.75389 244.677 40.0074"
                            stroke="url(#line-one-gradient)"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <div className="w-full h-full flex flex-col">
                      <p className="text-sm tracking-tight">
                        Connect Your Keys
                      </p>
                      <p className="text-xs text-neutral-700 tracking-tighter">
                        Your GitHub and Vercel keys are stored locally in your
                        browser — never sent to our servers.
                      </p>
                      <div className="flex-1 w-full flex flex-col gap-5 justify-center items-center">
                        <div className="relative w-full flex">
                          <input
                            value={gitToken || ""}
                            onChange={({ target }) => {
                              setGitToken(target.value);
                              setGitResult(null);
                            }}
                            type="text"
                            placeholder="Enter your Github PAT"
                            className={`rounded-sm bg-neutral-950 text-xs border py-2 px-3 w-full ${
                              gitResult
                                ? gitResult?.valid
                                  ? "border-green-800 text-green-800"
                                  : "border-red-800 text-red-800"
                                : "border-neutral-800"
                            } outline-0`}
                          />

                          {gitResult && !gitResult?.valid && (
                            <p className="absolute text-red-800 -bottom-4 text-[0.6rem]">
                              - {gitResult?.missingScopes}
                            </p>
                          )}

                          <AnimatePresence>
                            {(gitChecking || gitResult) && (
                              <motion.div
                                key="loader"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className={`absolute -right-1.5 -bottom-1.5 p-1 rounded-full border ${
                                  gitResult
                                    ? gitResult.valid
                                      ? "border-green-800 bg-neutral-950"
                                      : "border-red-800 bg-neutral-950"
                                    : "border-neutral-800 bg-neutral-950"
                                }`}
                              >
                                {gitChecking ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 1,
                                      ease: "linear",
                                    }}
                                    className="w-3 h-3 border-2 border-x-blue-500 border-gray-950 rounded-full"
                                  />
                                ) : (
                                  gitResult &&
                                  (gitResult.valid ? (
                                    <svg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 15 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M2 7.3C2.73333 8.2 4.32571 10 4.82857 10C5.33143 10 10.4857 6 13 4"
                                        stroke="#2F855A"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 15 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M11.3546 11.7377C9.14862 8.96478 4.53981 3.38316 3.75273 3.23998"
                                        stroke="#D32F2F"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M3.75279 11.7377C5.9588 8.96478 10.5676 3.38316 11.3547 3.23998"
                                        stroke="#D32F2F"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  ))
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="relative w-full flex items-center">
                          <input
                            value={vercelToken || ""}
                            onChange={({ target }) => {
                              setVercelToken(target.value);
                              setVercelResult(null);
                            }}
                            type="text"
                            placeholder="Input for Vercel Token"
                            className={`rounded-sm bg-neutral-950 text-xs border py-2 px-3 w-full ${
                              vercelResult
                                ? vercelResult?.valid
                                  ? "border-green-800 text-green-800"
                                  : "border-red-800 text-red-800"
                                : "border-neutral-800"
                            } outline-0`}
                          />

                          {vercelResult && !vercelResult?.valid && (
                            <p className="absolute text-red-800 -bottom-4 text-[0.6rem]">
                              - {vercelResult?.missingScopes}
                            </p>
                          )}

                          <AnimatePresence>
                            {(vercelChecking || vercelResult) && (
                              <motion.div
                                key="loader"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className={`absolute -right-1.5 -bottom-1.5 p-1 rounded-full border ${
                                  vercelResult
                                    ? vercelResult.valid
                                      ? "border-green-800 bg-neutral-950"
                                      : "border-red-800 bg-neutral-950"
                                    : "border-neutral-800 bg-neutral-950"
                                }`}
                              >
                                {vercelChecking ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 1,
                                      ease: "linear",
                                    }}
                                    className="w-3 h-3 border-2 border-x-blue-500 border-gray-950 rounded-full"
                                  />
                                ) : vercelResult?.valid ? (
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M2 7.3C2.73333 8.2 4.32571 10 4.82857 10C5.33143 10 10.4857 6 13 4"
                                      stroke="#2F855A"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M11.3546 11.7377C9.14862 8.96478 4.53981 3.38316 3.75273 3.23998"
                                      stroke="#D32F2F"
                                      stroke-linecap="round"
                                    />
                                    <path
                                      d="M3.75279 11.7377C5.9588 8.96478 10.5676 3.38316 11.3547 3.23998"
                                      stroke="#D32F2F"
                                      stroke-linecap="round"
                                    />
                                  </svg>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between">
              {step > 1 ? (
                <button
                  onClick={handlePrev}
                  className="text-xs py-1 px-5 rounded-sm border cursor-pointer flex gap-1 border-neutral-800"
                >
                  <Arrow className="rotate-180 mb-[0.1rem]" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              <button
                ref={nextBtnRef}
                onClick={handleNext}
                className="text-xs py-1 px-5 rounded-sm border cursor-pointer flex gap-1 border-neutral-800"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-3 h-3 border-2 border-x-blue-500 border-gray-950 rounded-full"
                  />
                ) : (
                  <>
                    {step === 3 ? "Save & Continue" : "Next"}
                    {step !== 3 && <Arrow className="mb-[0.1rem]" />}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
