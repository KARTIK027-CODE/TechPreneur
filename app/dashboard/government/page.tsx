"use client";

import { useState } from "react";
import {
    Building2,
    FileText,
    Search,
    CheckCircle2,
    Circle,
    ExternalLink,
    ShieldCheck,
    Award,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
    { id: "registrations", label: "Registrations", icon: Building2 },
    { id: "schemes", label: "Govt Schemes", icon: Award },
    { id: "documents", label: "Document Vault", icon: FileText },
];

const registrations = [
    {
        id: 1,
        title: "GST Registration",
        description: "Mandatory for businesses with turnover > ₹20 Lakhs.",
        status: "completed",
        link: "https://www.gst.gov.in/",
    },
    {
        id: 2,
        title: "Udhyam Aadhar (MSME)",
        description: "Get recognition as an MSME and avail benefits.",
        status: "pending",
        link: "https://udyamregistration.gov.in/",
    },
    {
        id: 3,
        title: "Startup India Recognition",
        description: "Tax exemptions and self-certification benefits.",
        status: "not-started",
        link: "https://www.startupindia.gov.in/",
    },
    {
        id: 4,
        title: "PAN & TAN",
        description: "Permanent Account Number for tax purposes.",
        status: "completed",
        link: "https://incometaxindia.gov.in/",
    },
];

const schemes = [
    {
        id: 1,
        title: "Startup India Seed Fund Scheme",
        sector: "All",
        benefit: "Financial assistance up to ₹20 Lakhs for prototype.",
        eligibility: "DPIIT recognized startups < 2 years old.",
        deadline: "Open all year",
    },
    {
        id: 2,
        title: "Production Linked Incentive (PLI)",
        sector: "Technology / Manufacturing",
        benefit: "4-6% incentive on incremental sales.",
        eligibility: "Manufacturing companies in specific sectors.",
        deadline: "Mar 31, 2026",
    },
    {
        id: 3,
        title: "Pradhan Mantri Mudra Yojana",
        sector: "All",
        benefit: "Loans up to ₹10 Lakhs without collateral.",
        eligibility: "Small businesses and startups.",
        deadline: "Open all year",
    },
];

export default function GovernmentPage() {
    const [activeTab, setActiveTab] = useState("registrations");

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Government & Compliance</h1>
                    <p className="text-slate-400">Manage registrations, discover schemes, and stay compliant.</p>
                </div>
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all",
                                activeTab === tab.id
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "registrations" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {registrations.map((item) => (
                        <div key={item.id} className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-3 rounded-xl",
                                        item.status === 'completed' ? "bg-emerald-500/10 text-emerald-400" :
                                            item.status === 'pending' ? "bg-amber-500/10 text-amber-400" :
                                                "bg-slate-800 text-slate-400"
                                    )}>
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-100">{item.title}</h3>
                                        <div className={cn("text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1",
                                            item.status === 'completed' ? "bg-emerald-500/10 text-emerald-400" :
                                                item.status === 'pending' ? "bg-amber-500/10 text-amber-400" :
                                                    "bg-slate-800 text-slate-400"
                                        )}>
                                            {item.status === 'completed' ? "Completed" : item.status === 'pending' ? "In Progress" : "Not Started"}
                                        </div>
                                    </div>
                                </div>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                            <p className="text-slate-400 text-sm mb-4">{item.description}</p>
                            {item.status !== 'completed' && (
                                <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                                    Start Application
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "schemes" && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                        <Search className="w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search schemes by sector (e.g. AgriTech, SaaS)..."
                            className="bg-transparent border-none focus:outline-none text-slate-200 flex-1 placeholder:text-slate-600"
                        />
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-xs font-medium text-slate-400 hover:text-white border border-white/10">
                            <Filter className="w-3 h-3" />
                            Filters
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {schemes.map((scheme) => (
                            <div key={scheme.id} className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg text-slate-100">{scheme.title}</h3>
                                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-medium">
                                            {scheme.sector}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-2"><strong className="text-slate-300">Benefit:</strong> {scheme.benefit}</p>
                                    <p className="text-slate-500 text-xs">Eligibility: {scheme.eligibility}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 min-w-[140px]">
                                    <span className="text-xs text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                                        Deadline: {scheme.deadline}
                                    </span>
                                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "documents" && (
                <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-slate-900/20 cursor-pointer hover:bg-slate-900/40 transition-colors">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200 mb-2">Detailed Document Vault</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-6">Securely store your Incorporation Certificate, MOA, AOA, and Tax Filings here.</p>
                    <button className="px-6 py-2 bg-white text-slate-950 rounded-full font-bold hover:bg-slate-200 transition-colors">
                        Upload New Document
                    </button>
                </div>
            )}
        </div>
    );
}
