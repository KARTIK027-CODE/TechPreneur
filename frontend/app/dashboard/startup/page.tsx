"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Edit, Loader2, Plus, X, Sparkles, ArrowRight, Target, Lightbulb, Zap } from "lucide-react";
import { startupApi } from "@/lib/api/startup";
import { useAuth } from "@/contexts/AuthContext";
import { Startup } from "@/types";
import Link from "next/link";
import CustomDropdown from "@/components/CustomDropdown";
import { motion } from "framer-motion";

export default function StartupProfilePage() {
    const { user } = useAuth();
    const [startup, setStartup] = useState<Startup | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form fields
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [stage, setStage] = useState("");
    const [vision, setVision] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [solution, setSolution] = useState("");

    // Add team member
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [memberName, setMemberName] = useState("");
    const [memberPassword, setMemberPassword] = useState("");
    const [memberDepartment, setMemberDepartment] = useState("");

    const isFounder = user?.role === "founder";

    const getFilteredMembers = () => {
        if (!startup?.teamMembers) return [];
        if (isFounder) return startup.teamMembers;
        return startup.teamMembers.filter((m: any) =>
            m.department === user?.department ||
            m.managerId === user?._id ||
            m._id === user?._id
        );
    };

    const filteredMembers = getFilteredMembers();

    useEffect(() => {
        fetchStartup();
    }, []);

    // Pre-fill department for team members
    useEffect(() => {
        if (showAddMember && !isFounder && user?.department) {
            setMemberDepartment(user.department);
        }
    }, [showAddMember, isFounder, user]);

    const fetchStartup = async () => {
        try {
            const data = await startupApi.getProfile();
            if (data) {
                setStartup(data);
                setName(data.name || "");
                setDomain(data.domain || "");
                setStage(data.stage || "");
                setVision(data.vision || "");
                setProblemStatement(data.problemStatement || "");
                setSolution(data.solution || "");
            }
        } catch (err: any) {
            console.error("Failed to load startup profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const updatedData = await startupApi.update({
                name,
                domain,
                stage,
                vision,
                problemStatement,
                solution
            });
            setStartup(updatedData);
            setEditing(false);
            setSuccess("Startup profile updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await startupApi.addTeamMember({
                name: memberName,
                email: memberEmail,
                password: memberPassword,
                department: memberDepartment || null
            });
            setShowAddMember(false);
            setMemberEmail("");
            setMemberName("");
            setMemberPassword("");
            setMemberDepartment("");
            fetchStartup();
            setSuccess("Team member added successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add team member");
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm("Are you sure you want to remove this team member?")) return;

        try {
            await startupApi.removeTeamMember(memberId);
            fetchStartup();
            setSuccess("Team member removed successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to remove team member");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    // No startup profile - Show setup CTA
    if (!startup) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full"
                >
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 p-12 text-center">
                        {/* Animated Background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl shadow-indigo-500/20">
                                <Building2 className="w-10 h-10 text-white" />
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-4">
                                No Startup Profile Yet
                            </h1>

                            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-md mx-auto">
                                {isFounder
                                    ? "Create your startup profile to unlock team collaboration, task management, and analytics."
                                    : "Your founder hasn't set up the startup profile yet. Please contact them to get started."
                                }
                            </p>

                            {isFounder && (
                                <Link
                                    href="/dashboard/settings?tab=company"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
                                >
                                    <span>Setup Startup Profile</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">{startup.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                                    {startup.domain}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30 capitalize">
                                    {startup.stage.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                    {isFounder && !editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </motion.div>

                {/* Alerts */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-xl">
                        {success}
                    </div>
                )}

                {editing ? (
                    /* Edit Form */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Edit Startup Profile</h2>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Company Name" value={name} onChange={setName} required />
                                <SelectField
                                    label="Domain"
                                    value={domain}
                                    onChange={setDomain}
                                    options={[
                                        "Technology",
                                        "Fintech",
                                        "Edtech",
                                        "Healthtech",
                                        "Consumer",
                                        "CleanTech"
                                    ]}
                                />
                            </div>
                            <SelectField
                                label="Stage"
                                value={stage}
                                onChange={setStage}
                                options={[
                                    { value: "ideation", label: "Ideation" },
                                    { value: "mvp", label: "MVP" },
                                    { value: "beta", label: "Beta" },
                                    { value: "early_traction", label: "Early Traction" }
                                ]}
                            />
                            <TextareaField label="Vision" value={vision} onChange={setVision} rows={3} />
                            <TextareaField label="Problem Statement" value={problemStatement} onChange={setProblemStatement} rows={3} />
                            <TextareaField label="Solution" value={solution} onChange={setSolution} rows={3} />

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:scale-105"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    /* View Mode */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Company Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            {startup.vision && (
                                <InfoCard icon={Target} title="Vision" content={startup.vision} gradient="from-indigo-500 to-blue-600" />
                            )}
                            {startup.problemStatement && (
                                <InfoCard icon={Lightbulb} title="Problem Statement" content={startup.problemStatement} gradient="from-amber-500 to-orange-600" />
                            )}
                            {startup.solution && (
                                <InfoCard icon={Zap} title="Solution" content={startup.solution} gradient="from-emerald-500 to-green-600" />
                            )}
                        </motion.div>

                        {/* Team Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-400" />
                                        <h3 className="text-xl font-bold text-white">Team</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowAddMember(true)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
                                        title="Add Team Member"
                                    >
                                        <Plus className="w-5 h-5 text-indigo-400" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {filteredMembers.length > 0 ? (
                                        filteredMembers.map((member: any) => {
                                            const isDirectReport = user?._id && member.managerId === user._id;
                                            return (
                                                <div
                                                    key={member._id}
                                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-white/10 hover:border-white/20 transition-all"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-medium text-white">{member.name}</p>
                                                            {isDirectReport && (
                                                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                                    Direct Report
                                                                </span>
                                                            )}
                                                            {member.role === 'founder' && (
                                                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                                                                    Founder
                                                                </span>
                                                            )}
                                                            {member.department && (
                                                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white/10 text-slate-300">
                                                                    {member.department}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-400">{member.email}</p>
                                                    </div>
                                                    {isFounder && member.role !== 'founder' && (
                                                        <button
                                                            onClick={() => handleRemoveMember(member._id)}
                                                            className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-slate-400 text-sm text-center py-8">No team members yet</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Create Member Modal */}
                {showAddMember && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md p-8 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Create Team Member</h3>
                            <form onSubmit={handleAddMember} className="space-y-4">
                                <InputField label="Name" value={memberName} onChange={setMemberName} required />
                                <InputField label="Email" type="email" value={memberEmail} onChange={setMemberEmail} required />
                                <InputField label="Password" type="password" value={memberPassword} onChange={setMemberPassword} required minLength={6} />
                                <CustomDropdown
                                    label="Department"
                                    value={memberDepartment}
                                    onChange={setMemberDepartment}
                                    options={[
                                        { value: "Business", label: "💼 Business" },
                                        { value: "Marketing", label: "📣 Marketing" },
                                        { value: "Development", label: "💻 Development" },
                                        { value: "Sales", label: "📈 Sales" },
                                        { value: "Operations", label: "⚙️ Operations" },
                                        { value: "Finance", label: "💰 Finance" },
                                        { value: "HR", label: "👥 HR" },
                                        { value: "Product", label: "🎯 Product" }
                                    ]}
                                    required
                                    disabled={!isFounder}
                                />

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddMember(false)}
                                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Components
function InfoCard({ icon: Icon, title, content, gradient }: any) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">{content}</p>
        </div>
    );
}

function InputField({ label, type = "text", value, onChange, required = false, minLength }: any) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                minLength={minLength}
                className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
                {Array.isArray(options) && typeof options[0] === 'string' ? (
                    options.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))
                ) : (
                    options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))
                )}
            </select>
        </div>
    );
}

function TextareaField({ label, value, onChange, rows = 4 }: any) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />
        </div>
    );
}
