"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { User, Building2, Lock, Bell, Save, Loader2, Sparkles, Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { startupApi } from "@/lib/api/startup";
import { Startup } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import CustomDropdown from "@/components/CustomDropdown";

type Tab = "profile" | "company" | "security" | "notifications";

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState<Tab>(tabParam === 'company' ? 'company' : 'profile');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [startup, setStartup] = useState<Startup | null>(null);

    // Profile fields
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    // Company fields
    const [companyName, setCompanyName] = useState("");
    const [domain, setDomain] = useState("Technology");
    const [stage, setStage] = useState("ideation");
    const [vision, setVision] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [solution, setSolution] = useState("");

    // Security fields
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        fetchStartup();
    }, []);

    const fetchStartup = async () => {
        try {
            const data = await startupApi.getProfile();
            if (data) {
                setStartup(data);
                setCompanyName(data.name || "");
                setDomain(data.domain || "Technology");
                setStage(data.stage || "ideation");
                setVision(data.vision || "");
                setProblemStatement(data.problemStatement || "");
                setSolution(data.solution || "");
            }
        } catch (err) {
            console.error("Failed to fetch startup", err);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // TODO: Add user update API endpoint
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!startup) {
                // Create new startup
                const newStartup = await startupApi.create({
                    name: companyName,
                    domain,
                    stage,
                    vision,
                    problemStatement,
                    solution
                });
                setStartup(newStartup);
                setSuccess("Company profile created successfully! Redirecting to dashboard...");
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                // Update existing startup
                const updated = await startupApi.update({
                    name: companyName,
                    domain,
                    stage,
                    vision,
                    problemStatement,
                    solution
                });
                setStartup(updated);
                setSuccess("Company info updated successfully!");
                setTimeout(() => setSuccess(""), 3000);
            }
            await fetchStartup();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update company info");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            // TODO: Add password change API endpoint
            setSuccess("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User, description: "Manage your personal information" },
        { id: "company", label: "Company", icon: Building2, description: "Configure your startup details" },
        { id: "security", label: "Security", icon: Lock, description: "Password and authentication" },
        { id: "notifications", label: "Notifications", icon: Bell, description: "Email and alert preferences" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Settings</h1>
                            <p className="text-slate-400 mt-1">Customize your VentureX experience</p>
                        </div>
                    </div>
                </motion.div>

                {/* Alerts */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl backdrop-blur-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-xl backdrop-blur-sm flex items-center gap-3"
                        >
                            <Check className="w-5 h-5" />
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="space-y-3">
                        {tabs.map((tab, idx) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <motion.button
                                    key={tab.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={`group w-full text-left p-4 rounded-2xl transition-all relative overflow-hidden ${isActive
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                                        : "bg-slate-900/50 border border-white/10 text-slate-400 hover:bg-slate-800/70 hover:border-white/20 hover:text-white"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`} />
                                        <span className="font-semibold">{tab.label}</span>
                                    </div>
                                    <p className={`text-xs ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                                        {tab.description}
                                    </p>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                                >
                                    <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
                                    <p className="text-slate-400 mb-8">Update your personal information</p>
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <FormField label="Full Name" value={name} onChange={setName} placeholder="John Doe" />
                                        <FormField label="Email Address" value={email} onChange={setEmail} type="email" placeholder="john@startup.com" />
                                        <FormField
                                            label="Role"
                                            value={user?.role === 'founder' ? 'Founder' : 'Team Member'}
                                            disabled
                                        />
                                        <SubmitButton loading={loading} icon={Save}>
                                            Save Changes
                                        </SubmitButton>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === "company" && (
                                <motion.div
                                    key="company"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white">Company Settings</h2>
                                        {!startup && (
                                            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30">
                                                Setup Required
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-400 mb-8">
                                        {startup ? "Manage your startup profile and information" : "Create your startup profile to get started"}
                                    </p>

                                    {user?.role !== 'founder' ? (
                                        <div className="text-center py-16 text-slate-400">
                                            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                            <p className="text-lg">Only founders can manage company settings</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpdateCompany} className="space-y-6">
                                            <FormField
                                                label="Company Name"
                                                value={companyName}
                                                onChange={setCompanyName}
                                                placeholder="Acme Inc."
                                                required
                                            />

                                            <CustomDropdown
                                                label="Industry Domain"
                                                value={domain}
                                                onChange={setDomain}
                                                options={[
                                                    { value: "Technology", label: "Technology & SaaS", emoji: "💻" },
                                                    { value: "Fintech", label: "Financial Technology", emoji: "💰" },
                                                    { value: "Edtech", label: "Education Technology", emoji: "📚" },
                                                    { value: "Healthtech", label: "Healthcare & Medtech", emoji: "🏥" },
                                                    { value: "Consumer", label: "Consumer Products", emoji: "🛍️" },
                                                    { value: "CleanTech", label: "Clean Technology", emoji: "🌱" }
                                                ]}
                                            />

                                            <CustomDropdown
                                                label="Current Stage"
                                                value={stage}
                                                onChange={setStage}
                                                options={[
                                                    { value: "ideation", label: "Ideation - Validating the idea", emoji: "💡" },
                                                    { value: "mvp", label: "MVP - Building the product", emoji: "🛠️" },
                                                    { value: "beta", label: "Beta - Testing with users", emoji: "🧪" },
                                                    { value: "early_traction", label: "Early Traction - Growing users", emoji: "🚀" }
                                                ]}
                                            />

                                            <TextareaField
                                                label="Vision Statement"
                                                value={vision}
                                                onChange={setVision}
                                                placeholder="What's your big picture goal? What change do you want to bring to the world?"
                                                rows={3}
                                            />

                                            <TextareaField
                                                label="Problem Statement"
                                                value={problemStatement}
                                                onChange={setProblemStatement}
                                                placeholder="What problem are you solving? Who faces this problem?"
                                                rows={3}
                                            />

                                            <TextareaField
                                                label="Solution"
                                                value={solution}
                                                onChange={setSolution}
                                                placeholder="How does your product solve this problem? What makes it unique?"
                                                rows={3}
                                            />

                                            <SubmitButton loading={loading} icon={startup ? Save : ArrowRight}>
                                                {startup ? "Update Company Profile" : "Create Company Profile"}
                                            </SubmitButton>
                                        </form>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "security" && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                                >
                                    <h2 className="text-2xl font-bold text-white mb-2">Security Settings</h2>
                                    <p className="text-slate-400 mb-8">Manage your password and authentication</p>
                                    <form onSubmit={handleChangePassword} className="space-y-6">
                                        <FormField
                                            label="Current Password"
                                            value={currentPassword}
                                            onChange={setCurrentPassword}
                                            type="password"
                                        />
                                        <FormField
                                            label="New Password"
                                            value={newPassword}
                                            onChange={setNewPassword}
                                            type="password"
                                            minLength={6}
                                        />
                                        <FormField
                                            label="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={setConfirmPassword}
                                            type="password"
                                            minLength={6}
                                        />
                                        <SubmitButton loading={loading} icon={Lock}>
                                            Change Password
                                        </SubmitButton>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === "notifications" && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                                >
                                    <h2 className="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
                                    <p className="text-slate-400 mb-8">Choose what updates you want to receive</p>
                                    <div className="space-y-4">
                                        <NotificationToggle
                                            title="Task Updates"
                                            description="Get notified when tasks are assigned to you or status changes"
                                        />
                                        <NotificationToggle
                                            title="Milestone Completed"
                                            description="Receive alerts when team completes milestones"
                                        />
                                        <NotificationToggle
                                            title="Team Activity"
                                            description="Stay updated on team member activities and contributions"
                                        />
                                        <NotificationToggle
                                            title="Weekly Summary"
                                            description="Get a weekly digest of your startup's progress and metrics"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Components
function FormField({ label, value, onChange, type = "text", placeholder = "", disabled = false, required = false, minLength }: any) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                minLength={minLength}
                className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: any) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

function TextareaField({ label, value, onChange, placeholder = "", rows = 4 }: any) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
        </div>
    );
}

function SubmitButton({ loading, icon: Icon, children }: any) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
}

function NotificationToggle({ title, description }: { title: string; description: string }) {
    const [enabled, setEnabled] = useState(true);

    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-950/50 border border-white/10 hover:border-white/20 transition-all group">
            <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">{title}</h4>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
            <button
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${enabled ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-slate-700"
                    }`}
            >
                <motion.span
                    layout
                    className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
                    animate={{ x: enabled ? 26 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </button>
        </div>
    );
}
