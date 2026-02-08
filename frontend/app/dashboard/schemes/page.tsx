"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, ExternalLink, Search, Filter, CheckCircle, ArrowRight, IndianRupee, Calendar, Building2, Sparkles } from "lucide-react";

const SCHEME_CATEGORIES = ["All", "Funding", "Tax Benefits", "Incubation", "Exports", "Technology"];

const GOVERNMENT_SCHEMES = [
    {
        id: 1,
        name: "Startup India Seed Fund Scheme (SISFS)",
        category: "Funding",
        authority: "Department for Promotion of Industry and Internal Trade (DPIIT)",
        description: "Financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.",
        funding: "Up to ₹20 Lakhs",
        eligibility: "DPIIT recognized startups, incorporated within 2 years",
        benefits: [
            "Seed funding up to ₹20 lakhs",
            "Proof of concept support",
            "Prototype development funding",
            "Market entry assistance"
        ],
        applicationLink: "https://seedfund.startupindia.gov.in/",
        color: "emerald"
    },
    {
        id: 2,
        name: "Fund of Funds for Startups (FFS)",
        category: "Funding",
        authority: "SIDBI (Small Industries Development Bank of India)",
        description: "₹10,000 crore corpus to provide funding support to startups through SEBI registered Alternate Investment Funds (AIFs).",
        funding: "Up to ₹10,000 Crores",
        eligibility: "Startups via SEBI registered AIFs",
        benefits: [
            "Access to venture capital",
            "Equity funding support",
            "Growth capital for scaling",
            "No direct application - via AIFs"
        ],
        applicationLink: "https://www.indiainvestmentgrid.gov.in/fund-of-funds",
        color: "blue"
    },
    {
        id: 3,
        name: "Startup India Tax Exemption",
        category: "Tax Benefits",
        authority: "Ministry of Commerce and Industry",
        description: "3-year tax holiday for DPIIT recognized startups. Exemption from income tax for 3 consecutive years out of first 10 years.",
        funding: "Tax Exemption",
        eligibility: "DPIIT recognized startups, turnover < ₹100 crores",
        benefits: [
            "100% tax exemption for 3 years",
            "No angel tax for DPIIT startups",
            "Capital gains exemption",
            "Simplified compliance"
        ],
        applicationLink: "https://www.startupindia.gov.in/content/sih/en/tax_exemption.html",
        color: "amber"
    },
    {
        id: 4,
        name: "Atal Innovation Mission (AIM)",
        category: "Incubation",
        authority: "NITI Aayog",
        description: "Atal Incubation Centers (AICs) to foster innovation and entrepreneurship. Provides world-class incubation facilities.",
        funding: "Up to ₹10 Crores",
        eligibility: "Innovative startups in technology sectors",
        benefits: [
            "Incubation support",
            "Mentorship programs",
            "Access to infrastructure",
            "Networking opportunities"
        ],
        applicationLink: "https://aim.gov.in/",
        color: "purple"
    },
    {
        id: 5,
        name: "Credit Guarantee Scheme for Startups (CGSS)",
        category: "Funding",
        authority: "National Credit Guarantee Trustee Company (NCGTC)",
        description: "Provides credit guarantee to loans extended by banks to startups. Up to 80% guarantee coverage.",
        funding: "Loan Guarantee",
        eligibility: "DPIIT recognized startups, loans up to ₹10 crores",
        benefits: [
            "80% credit guarantee",
            "Easier loan approval",
            "Reduced collateral requirements",
            "Lower interest rates"
        ],
        applicationLink: "https://www.ncgtc.in/",
        color: "indigo"
    },
    {
        id: 6,
        name: "Pradhan Mantri MUDRA Yojana (PMMY)",
        category: "Funding",
        authority: "Ministry of Finance",
        description: "Provides loans to micro-enterprises and startups under three categories: Shishu, Kishore, and Tarun.",
        funding: "Up to ₹10 Lakhs",
        eligibility: "Micro-enterprises, small businesses, startups",
        benefits: [
            "Shishu: Up to ₹50,000",
            "Kishore: ₹50,001 to ₹5 lakhs",
            "Tarun: ₹5,00,001 to ₹10 lakhs",
            "No collateral required"
        ],
        applicationLink: "https://www.mudra.org.in/",
        color: "rose"
    },
    {
        id: 7,
        name: "National Initiative for Developing and Harnessing Innovations (NIDHI)",
        category: "Technology",
        authority: "Department of Science & Technology",
        description: "Nurtures startups through scouting, supporting, and scaling innovations. Multiple sub-schemes for different stages.",
        funding: "Various",
        eligibility: "Technology-based startups",
        benefits: [
            "Pre-incubation support",
            "Seed funding (NIDHI-PRAYAS)",
            "Technology development support",
            "Entrepreneurship training"
        ],
        applicationLink: "https://nidhi.dstapps.in/",
        color: "teal"
    },
    {
        id: 8,
        name: "Stand-Up India Scheme",
        category: "Funding",
        authority: "Ministry of Finance",
        description: "Facilitates bank loans for SC/ST and women entrepreneurs to set up greenfield enterprises.",
        funding: "₹10 Lakhs to ₹1 Crore",
        eligibility: "SC/ST and women entrepreneurs",
        benefits: [
            "Bank loans ₹10L - ₹1Cr",
            "7-year repayment period",
            "Handholding support",
            "Credit guarantee coverage"
        ],
        applicationLink: "https://www.standupmitra.in/",
        color: "pink"
    },
    {
        id: 9,
        name: "SAMRIDH - Startups Accelerators of MeitY for pRoduct Innovation, Development and growtH",
        category: "Technology",
        authority: "Ministry of Electronics & IT (MeitY)",
        description: "Supports software product startups through grants and accelerator programs.",
        funding: "Up to ₹40 Lakhs",
        eligibility: "Software product startups",
        benefits: [
            "Grant up to ₹40 lakhs",
            "Acceleration support",
            "Market access",
            "Technology infrastructure"
        ],
        applicationLink: "https://www.meity.gov.in/",
        color: "cyan"
    },
    {
        id: 10,
        name: "Startup India Innovation Week",
        category: "Incubation",
        authority: "DPIIT",
        description: "Annual event celebrating startups with various competitions, workshops, and funding opportunities.",
        funding: "Recognition & Awards",
        eligibility: "All Indian startups",
        benefits: [
            "National recognition",
            "Networking opportunities",
            "Investor connect",
            "Media exposure"
        ],
        applicationLink: "https://www.startupindia.gov.in/",
        color: "orange"
    }
];

const colorClasses: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    emerald: { bg: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-500/30", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" },
    blue: { bg: "from-blue-500/10 to-cyan-500/10", border: "border-blue-500/30", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300" },
    amber: { bg: "from-amber-500/10 to-orange-500/10", border: "border-amber-500/30", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-300" },
    purple: { bg: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/30", text: "text-purple-400", badge: "bg-purple-500/20 text-purple-300" },
    indigo: { bg: "from-indigo-500/10 to-blue-500/10", border: "border-indigo-500/30", text: "text-indigo-400", badge: "bg-indigo-500/20 text-indigo-300" },
    rose: { bg: "from-rose-500/10 to-pink-500/10", border: "border-rose-500/30", text: "text-rose-400", badge: "bg-rose-500/20 text-rose-300" },
    teal: { bg: "from-teal-500/10 to-cyan-500/10", border: "border-teal-500/30", text: "text-teal-400", badge: "bg-teal-500/20 text-teal-300" },
    pink: { bg: "from-pink-500/10 to-rose-500/10", border: "border-pink-500/30", text: "text-pink-400", badge: "bg-pink-500/20 text-pink-300" },
    cyan: { bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/30", text: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-300" },
    orange: { bg: "from-orange-500/10 to-amber-500/10", border: "border-orange-500/30", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-300" }
};

export default function GovernmentSchemesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredSchemes = GOVERNMENT_SCHEMES.filter(scheme => {
        const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scheme.authority.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || scheme.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Landmark className="w-8 h-8 text-indigo-400" />
                    <h1 className="text-3xl font-black">Government Schemes</h1>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                        Founder Only
                    </span>
                </div>
                <p className="text-slate-400">Explore funding, tax benefits, and support programs for Indian startups</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <div className="text-2xl font-bold text-white">{GOVERNMENT_SCHEMES.filter(s => s.category === "Funding").length}</div>
                    <div className="text-sm text-slate-400">Funding Schemes</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="text-2xl font-bold text-white">{GOVERNMENT_SCHEMES.filter(s => s.category === "Tax Benefits").length}</div>
                    <div className="text-sm text-slate-400">Tax Benefits</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <div className="text-2xl font-bold text-white">{GOVERNMENT_SCHEMES.filter(s => s.category === "Incubation").length}</div>
                    <div className="text-sm text-slate-400">Incubation Programs</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                    <div className="text-2xl font-bold text-white">{GOVERNMENT_SCHEMES.filter(s => s.category === "Technology").length}</div>
                    <div className="text-sm text-slate-400">Technology Support</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search schemes by name, description, or authority..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {SCHEME_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${selectedCategory === category
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-white/10"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schemes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSchemes.map((scheme, idx) => {
                    const colors = colorClasses[scheme.color];
                    return (
                        <motion.div
                            key={scheme.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`p-6 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Landmark className={`w-5 h-5 ${colors.text}`} />
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${colors.badge}`}>
                                            {scheme.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{scheme.name}</h3>
                                    <p className="text-sm text-slate-400">{scheme.authority}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-slate-300 text-sm mb-4 leading-relaxed">{scheme.description}</p>

                            {/* Key Info */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <IndianRupee className={`w-4 h-4 ${colors.text}`} />
                                    <div>
                                        <div className="text-xs text-slate-500">Funding</div>
                                        <div className="font-semibold text-white">{scheme.funding}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Building2 className={`w-4 h-4 ${colors.text}`} />
                                    <div>
                                        <div className="text-xs text-slate-500">Eligibility</div>
                                        <div className="font-semibold text-white text-xs">{scheme.eligibility}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="mb-4">
                                <div className="text-sm font-semibold text-slate-300 mb-2">Key Benefits:</div>
                                <ul className="space-y-1">
                                    {scheme.benefits.slice(0, 3).map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                            <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <a
                                href={scheme.applicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border ${colors.border} ${colors.text} font-semibold text-sm transition-all group`}
                            >
                                Apply Now
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </motion.div>
                    );
                })}
            </div>

            {/* No Results */}
            {filteredSchemes.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-white mb-2">No schemes found</h3>
                    <p className="text-slate-400">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Footer Note */}
            <div className="mt-12 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-white mb-2">Important Note</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Most schemes require DPIIT (Department for Promotion of Industry and Internal Trade) recognition. Register your startup at{" "}
                            <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                                startupindia.gov.in
                            </a>{" "}
                            to unlock these benefits. Eligibility criteria and funding amounts are subject to change. Please visit official websites for the most up-to-date information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
