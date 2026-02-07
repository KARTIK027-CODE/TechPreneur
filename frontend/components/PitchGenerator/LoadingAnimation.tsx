"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function LoadingAnimation() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                {/* Rotating Rings */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30 w-full h-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border-2 border-dashed border-purple-500/30 w-40 h-40"
                />

                {/* Center Pulse */}
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/50 to-purple-600/50 blur-xl"
                    />
                    <Brain className="w-12 h-12 text-white relative z-10" />
                </div>
            </div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2"
            >
                AI is crafting your pitch...
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400 text-sm max-w-xs"
            >
                Analyzing market data, structuring value proposition, and optimizing for impact.
            </motion.p>
        </div>
    );
}
