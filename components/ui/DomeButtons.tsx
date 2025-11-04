import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface GoProps {
  started: boolean;
  startMic: () => void;
}

interface PlayPauseProps {
  started: boolean;
  isListening: boolean;
  stopMic: () => void;
  startMic: () => void;
}

export const Go = ({ started, startMic }: GoProps) => {
  return (
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
            className="h-28 w-28 flex justify-center items-center bg-orange-900/35 hover:bg-orange-900/40 border border-orange-900 text-white rounded-full cursor-pointer"
          >
            <p className="text-3xl font-bold ">Go!</p>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PlayPause = ({ started, isListening, stopMic, startMic }: PlayPauseProps) => {
  return (
    <AnimatePresence>
      {started && (
        <motion.button
          key="control-btn"
          initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.8, filter: "blur(12px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={isListening ? stopMic : startMic}
          className="fixed bottom-6 right-6 w-22 h-8 flex justify-center items-center bg-orange-900/35 rounded-lg hover:bg-orange-900/40 border border-orange-900 text-white cursor-pointer z-50 shadow-lg"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isListening ? (
              <motion.div
                key="stop-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center text-md font-mono"
              >
                <p>pause</p>
                {/* <Square className="text-white" /> */}
              </motion.div>
            ) : (
              <motion.div
                key="play-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center text-md font-mono"
              >
                <p>play</p>
                {/* <Play className="text-white" /> */}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
