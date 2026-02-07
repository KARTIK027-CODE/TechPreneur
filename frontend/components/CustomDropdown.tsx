"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
    value: string;
    label: string;
    emoji?: string;
}

interface CustomDropdownProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    required?: boolean;
    disabled?: boolean;
}

export default function CustomDropdown({ label, value, onChange, options, required, disabled = false }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>

            <button
                type="button"
                onClick={toggleDropdown}
                className={`w-full h-12 px-4 rounded-xl border flex items-center justify-between transition-all ${disabled
                    ? "border-white/5 bg-white/5 cursor-not-allowed text-slate-500"
                    : isOpen
                        ? "border-indigo-500 bg-slate-900 ring-2 ring-indigo-500/20 cursor-pointer"
                        : "border-white/10 bg-slate-950/50 hover:border-white/20 hover:bg-slate-900 cursor-pointer"
                    }`}
                disabled={disabled}
            >
                <span className={selectedOption ? "text-white" : "text-slate-500"}>
                    {selectedOption ? (
                        <div className="flex items-center gap-2">
                            {selectedOption.emoji && <span>{selectedOption.emoji}</span>}
                            <span>{selectedOption.label}</span>
                        </div>
                    ) : "Select an option"}
                </span>
                {!disabled && (
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left group"
                            >
                                <span className={`text-sm ${value === option.value ? "text-indigo-400 font-medium" : "text-slate-300 group-hover:text-white"}`}>
                                    {option.emoji && <span className="mr-2">{option.emoji}</span>}
                                    {option.label}
                                </span>
                                {value === option.value && (
                                    <Check className="w-4 h-4 text-indigo-400" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
