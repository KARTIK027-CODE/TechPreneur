"use client";

import { useState } from "react";
import { Mic, MicOff, X } from "lucide-react";

export function VoiceAssistant() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [showChat, setShowChat] = useState(false);

    const startListening = () => {
        // Check if browser supports speech recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser doesn't support voice recognition. Please use Chrome or Safari.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript("Listening...");
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            setTranscript("Error: " + event.error);
        };

        recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            setTranscript(transcript);
            setShowChat(true);
            await handleVoiceCommand(transcript);
        };

        recognition.start();
    };

    const handleVoiceCommand = async (command: string) => {
        try {
            // Get token from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/voice-assistant', {
                method: 'POST',
                headers,
                body: JSON.stringify({ query: command })
            });

            const data = await response.json();
            setResponse(data.answer);
            speakResponse(data.answer);
        } catch (error) {
            console.error('Error processing voice command:', error);
            setResponse("Sorry, I couldn't process that.");
        }
    };

    const speakResponse = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="relative">
            <button
                onClick={startListening}
                disabled={isListening}
                className={`p-2 rounded-lg transition-all ${isListening
                    ? "bg-red-500/20 text-red-400 animate-pulse"
                    : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                    }`}
                title="Voice Assistant"
            >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {showChat && (transcript || response) && (
                <div className="absolute right-0 top-12 bg-slate-900 border border-white/10 rounded-lg p-4 w-80 shadow-xl z-50">
                    {/* Close button */}
                    <button
                        onClick={() => {
                            setShowChat(false);
                            setTranscript("");
                            setResponse("");
                        }}
                        className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {transcript && (
                        <div className="mb-2 mt-2 pr-6">
                            <p className="text-xs text-slate-500">You said:</p>
                            <p className="text-sm text-white">{transcript}</p>
                        </div>
                    )}
                    {response && (
                        <div className="pr-6">
                            <p className="text-xs text-slate-500">Assistant:</p>
                            <p className="text-sm text-indigo-400">{response}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
