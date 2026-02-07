"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Users, Loader2, Building2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "founder" | "member" | null;

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<"role" | "details">("role");
    const [role, setRole] = useState<Role>(null);
    const [loading, setLoading] = useState(false);

    // Form Stats
    const [companyName, setCompanyName] = useState("");
    const [sector, setSector] = useState("Technology");

    // Member Stats
    const [email, setEmail] = useState("");
    const [detectedRole, setDetectedRole] = useState<string | null>(null);

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setStep("details");
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setEmail(val);

        // Smart Parsing Logic
        if (val.includes("@")) {
            const [user, domain] = val.split("@");
            const dept = user.toLowerCase();
            const company = domain.split(".")[0];

            // Auto-detect department
            if (dept.includes("hr")) setDetectedRole("HR");
            else if (dept.includes("finance") || dept.includes("accounts")) setDetectedRole("Finance");
            else if (dept.includes("marketing") || dept.includes("growth")) setDetectedRole("Marketing");
            else if (dept.includes("tech") || dept.includes("dev") || dept.includes("eng")) setDetectedRole("Tech");
            else if (dept.includes("ceo") || dept.includes("founder")) setDetectedRole("Founder");
            else setDetectedRole("Member");

            // Auto-fill company name if empty
            if (company && company.length > 2) {
                // Capitalize first letter
                const formattedCompany = company.charAt(0).toUpperCase() + company.slice(1);
                // Only set if we are in member mode, but we can't set state for companyName here directly as it's used for founder flow too.
                // For member flow, we'll use this derived company name in the summary.
            }
        } else {
            setDetectedRole(null);
        }
    };

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            if (role === 'founder') {
                localStorage.setItem("companyName", companyName);
                localStorage.setItem("companySector", sector);
                localStorage.setItem("userRole", "founder");
                localStorage.setItem("userDepartment", "CEO");
            } else {
                // Parse company from email for members
                const domain = email.split("@")[1];
                const company = domain ? domain.split(".")[0] : "Tech Startup";
                const formattedCompany = company.charAt(0).toUpperCase() + company.slice(1);

                localStorage.setItem("companyName", formattedCompany);
                localStorage.setItem("companySector", "Technology"); // Default for now
                localStorage.setItem("userRole", "member");
                localStorage.setItem("userDepartment", detectedRole || "Member");
            }

            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-lg space-y-8">
                <div className="space-y-2 text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        {step === "role" ? "Choose your path" : "Tell us about your startup"}
                    </h1>
                    <p className="text-slate-400">
                        {step === "role"
                            ? "Are you starting a new venture or joining an existing one?"
                            : "Let's set up your workspace for success."}
                    </p>
                </div>

                {step === "role" ? (
                    <div className="grid gap-4">
                        <button
                            onClick={() => handleRoleSelect("founder")}
                            className="flex flex-col items-center justify-center p-6 border-2 border-white/10 rounded-xl hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group bg-slate-900/50"
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                <Rocket className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" />
                            </div>
                            <h3 className="font-semibold text-lg text-white">I am a Founder</h3>
                            <p className="text-sm text-slate-400 text-center mt-2">I want to launch a new startup and build my team.</p>
                        </button>

                        <button
                            onClick={() => handleRoleSelect("member")}
                            className="flex flex-col items-center justify-center p-6 border-2 border-white/10 rounded-xl hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group bg-slate-900/50"
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                <Users className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" />
                            </div>
                            <h3 className="font-semibold text-lg text-white">I am a Team Member</h3>
                            <p className="text-sm text-slate-400 text-center mt-2">I want to join an existing startup workspace.</p>
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleComplete} className="space-y-6 animate-in fade-in slide-in-from-right-8 bg-slate-900/50 p-8 rounded-2xl border border-white/10">
                        {role === "founder" ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-slate-300">Startup Name</label>
                                    <input
                                        required
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Acme Inc."
                                        className="flex h-12 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-600 focus-visible:outline-none focus-visible:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-slate-300">One-Liner Pitch</label>
                                    <textarea required placeholder="Uber for cats..." className="flex min-h-[80px] w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus-visible:outline-none focus-visible:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-slate-300">Industry Sector</label>
                                    <select
                                        value={sector}
                                        onChange={(e) => setSector(e.target.value)}
                                        className="flex h-12 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-indigo-500 transition-colors"
                                    >
                                        <option value="Technology">Technology & SaaS</option>
                                        <option value="Fintech">Fintech</option>
                                        <option value="Edtech">Edtech</option>
                                        <option value="Healthtech">Healthtech</option>
                                        <option value="Consumer">Consumer Goods</option>
                                        <option value="CleanTech">CleanTech</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-slate-300">Work Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            required
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            placeholder="name@company.com"
                                            className="flex h-12 w-full rounded-lg border border-white/10 bg-slate-950 pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus-visible:outline-none focus-visible:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {email && detectedRole && (
                                    <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-indigo-200 font-semibold">Smart Detection</span>
                                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">Beta</span>
                                        </div>
                                        <div className="space-y-1 text-slate-300">
                                            <p>Department: <span className="text-white font-medium">{detectedRole}</span></p>
                                            <p>Company: <span className="text-white font-medium capitalize">{email.split("@")[1]?.split(".")[0]}</span></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setStep("role")}
                                className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium border border-white/10 bg-transparent hover:bg-white/5 text-white h-12 px-4 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 h-12 px-4 transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enter Workspace"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

