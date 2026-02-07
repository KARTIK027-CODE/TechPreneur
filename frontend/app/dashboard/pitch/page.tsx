"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic,
    Presentation,
    Mail,
    Sparkles,
    Copy,
    Check,
    RefreshCw,
    ArrowRight,
    ArrowLeft,
    Lightbulb,
    Zap
} from "lucide-react";
import LoadingAnimation from "@/components/PitchGenerator/LoadingAnimation";
import TypingAnimation from "@/components/PitchGenerator/TypingAnimation";
import { useAuth } from "@/contexts/AuthContext";
import { startupApi } from "@/lib/api/startup";

// Types
type PitchType = 'elevator' | 'investor' | 'email';

const PITCH_TYPES = [
    {
        id: 'elevator',
        title: 'Elevator Pitch',
        description: 'A 30-second persuasive speech to spark interest.',
        icon: Mic,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'investor',
        title: 'Investor Deck',
        description: 'Structured narrative for your seed round deck.',
        icon: Presentation,
        color: 'from-purple-500 to-indigo-500'
    },
    {
        id: 'email',
        title: 'Cold Outreach',
        description: 'High-conversion email template for potential leads.',
        icon: Mail,
        color: 'from-pink-500 to-rose-500'
    }
];

export default function PitchGeneratorPage() {
    const { user } = useAuth();
    const [step, setStep] = useState<'select' | 'generating' | 'result'>('select');
    const [pitchType, setPitchType] = useState<PitchType | null>(null);
    const [generatedPitch, setGeneratedPitch] = useState('');
    const [copied, setCopied] = useState(false);
    const [startup, setStartup] = useState<any>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStartup = async () => {
            try {
                const data = await startupApi.getProfile();
                setStartup(data);
            } catch (error) {
                console.error("Failed to fetch startup profile", error);
            }
        };
        fetchStartup();
    }, []);

    const generatePitch = async (type: PitchType) => {
        setPitchType(type);
        setStep('generating');
        setError('');

        try {
            // Call Gemini API for AI-powered pitch generation
            const response = await fetch('/api/pitch/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pitchType: type,
                    startupData: startup,
                    userData: user
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate pitch');
            }

            const data = await response.json();

            // Wait a bit for dramatic effect
            await new Promise(resolve => setTimeout(resolve, 1500));

            setGeneratedPitch(data.pitch);
            setStep('result');
            setIsTyping(true);

        } catch (error) {
            console.error('Pitch generation error:', error);
            setError('Failed to generate pitch. Please try again.');
            setStep('select');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPitch);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const reset = () => {
        setStep('select');
        setPitchType(null);
        setIsTyping(false);
    };

    return (
        <div className="max-w-5xl mx-auto p-8 min-h-screen">
            <header className="mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered by Gemini</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Perfect Pitch</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Generate investor-ready decks, elevator pitches, and outreach emails instantly using AI.
                </p>
            </header>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
                >
                    {error}
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {step === 'select' && (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid md:grid-cols-3 gap-6"
                    >
                        {PITCH_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => generatePitch(type.id as PitchType)}
                                className="group relative p-8 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10 text-left"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} p-0.5 mb-6`}>
                                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                        <type.icon className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">{type.description}</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                    <Zap className="w-4 h-4" />
                                    Generate with AI <ArrowRight className="w-4 h-4" />
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}

                {step === 'generating' && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px]"
                    >
                        <LoadingAnimation />
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 text-slate-400 text-center"
                        >
                            <Sparkles className="w-4 h-4 inline-block mr-2" />
                            AI is crafting your perfect pitch...
                        </motion.p>
                    </motion.div>
                )}

                {step === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-3xl mx-auto"
                    >
                        <button
                            onClick={reset}
                            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> Create Another Pitch
                        </button>

                        <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={isTyping ? {
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0]
                                        } : {}}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500"
                                    >
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </motion.div>
                                    <div>
                                        <h3 className="font-bold text-white">AI Generated Pitch</h3>
                                        <p className="text-xs text-slate-400">Powered by Gemini AI</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors border border-white/5"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={() => generatePitch(pitchType!)}
                                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/5"
                                        title="Regenerate"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-950/50">
                                <div className="prose prose-invert max-w-none">
                                    {isTyping ? (
                                        <TypingAnimation
                                            text={generatedPitch}
                                            speed={20}
                                            onComplete={() => setIsTyping(false)}
                                        />
                                    ) : (
                                        <pre className="whitespace-pre-wrap font-sans text-lg text-slate-300 leading-relaxed bg-transparent border-none p-0">
                                            {generatedPitch}
                                        </pre>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-indigo-900/10 border-t border-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 mt-1">
                                        <Lightbulb className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-indigo-300 text-sm mb-1">AI Pro Tip</h4>
                                        <p className="text-sm text-slate-400">
                                            {pitchType === 'elevator' && "Keep eye contact and pause after the problem statement to let it sink in."}
                                            {pitchType === 'investor' && "Investors look for team fit. Ensure you emphasize why YOU are the right team to solve this."}
                                            {pitchType === 'email' && "Personalization wins deals. Add a custom PS line referencing their recent work."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
