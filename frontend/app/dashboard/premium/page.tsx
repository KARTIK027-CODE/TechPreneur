"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Crown,
    Check,
    Sparkles,
    Zap,
    Shield,
    Users,
    TrendingUp,
    Rocket,
    Star,
    ArrowRight,
    X,
    Mic,
    BarChart3,
    Infinity,
    Handshake,
    FileText,
    Headphones,
    DollarSign,
    Flame,
    Lock,
    Target,
    Bot,
    Palette,
    Plug,
    Settings,
    MessageCircle,
    FileCheck,
    UserCheck,
    PieChart,
    Building
} from "lucide-react";

type BillingCycle = 'monthly' | 'yearly';

interface FeatureItem {
    icon: any;
    text: string;
}

const PLANS = [
    {
        id: 'bootstrap',
        name: 'Bootstrap',
        tagline: 'For early-stage founders',
        price: { monthly: 0, yearly: 0 },
        icon: Sparkles,
        color: 'from-slate-500 to-slate-600',
        popular: false,
        features: [
            { icon: Users, text: 'Up to 5 team members' },
            { icon: BarChart3, text: 'Basic dashboard & analytics' },
            { icon: Check, text: 'Up to 50 tasks' },
            { icon: Target, text: '3 milestones tracking' },
            { icon: Headphones, text: 'Email support' },
            { icon: Sparkles, text: '3 AI pitches/month' },
            { icon: Users, text: 'Community access' }
        ] as FeatureItem[],
        limitations: [
            'No AI voice assistant',
            'No advanced analytics',
            'No investor database',
            'No integrations'
        ]
    },
    {
        id: 'premium',
        name: 'Growth',
        tagline: 'For growing startups',
        price: { monthly: 49, yearly: 470 },
        icon: Crown,
        color: 'from-indigo-500 to-purple-500',
        popular: true,
        features: [
            { icon: Users, text: 'Up to 25 team members' },
            { icon: Mic, text: 'AI Voice Assistant (unlimited)' },
            { icon: BarChart3, text: 'Advanced analytics dashboard' },
            { icon: Infinity, text: 'Unlimited tasks & milestones' },
            { icon: Sparkles, text: 'Unlimited AI pitch generation' },
            { icon: Handshake, text: 'Team collaboration tools' },
            { icon: FileText, text: 'Custom workflows & templates' },
            { icon: Headphones, text: 'Priority support' },
            { icon: DollarSign, text: 'Financial modeling tools' },
            { icon: Flame, text: 'Burn rate forecasting' },
            { icon: FileCheck, text: 'Export reports (PDF/CSV)' },
            { icon: Building, text: 'Department management' },
            { icon: Lock, text: 'Role-based permissions' }
        ] as FeatureItem[],
        premiumBadges: [
            'AI Market Research',
            'Compliance Checklist',
            'Cap Table Management',
            'Fundraising Tracker'
        ]
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        tagline: 'For funded startups',
        price: { monthly: 299, yearly: 2990 },
        icon: Rocket,
        color: 'from-amber-500 to-orange-500',
        popular: false,
        custom: true,
        features: [
            {icon: Sparkles, text: 'All features of Growth plan'},
            { icon: Users, text: 'Unlimited team members' },
            { icon: Bot, text: 'Custom AI training' },
            { icon: Lock, text: 'Advanced security' },
            { icon: Settings, text: 'Custom feature development' },
            { icon: MessageCircle, text: '24/7 support' },
            { icon: FileCheck, text: 'Legal document templates' },
            { icon: UserCheck, text: 'Investor pitch expert review' },
            { icon: PieChart, text: 'Board meeting management' },
            { icon: Building, text: 'Multi-startup management' },
        ] as FeatureItem[],
        enterpriseBadges: [
            'Dedicated Server',
            'Custom Integrations',
            'Strategy Sessions',
            'Priority Features'
        ]
    }
];

export default function PremiumPage() {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    return (
        <div className="max-w-7xl mx-auto p-8 min-h-screen">
            {/* Header */}
            <header className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6"
                >
                    <Crown className="w-4 h-4" />
                    <span>Premium Plans</span>
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                    Scale Your Startup with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Premium
                    </span>
                </h1>

                <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                    Unlock AI-powered features, advanced analytics, and dedicated support to accelerate your growth.
                </p>

                {/* Billing Toggle */}
                <div className="inline-flex items-center gap-4 p-1 bg-slate-900 border border-white/10 rounded-lg">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'monthly'
                            ? 'bg-white text-slate-900'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${billingCycle === 'yearly'
                            ? 'bg-white text-slate-900'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Yearly
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                            Save 20%
                        </span>
                    </button>
                </div>
            </header>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                {PLANS.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative p-8 rounded-2xl border ${plan.popular
                            ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/50 scale-105'
                            : 'bg-slate-900/50 border-white/10'
                            } hover:border-white/20 transition-all`}
                    >
                        {/* Popular Badge */}
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white text-xs font-bold flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                MOST POPULAR
                            </div>
                        )}

                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} p-0.5 mb-6`}>
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                <plan.icon className="w-7 h-7 text-white" />
                            </div>
                        </div>

                        {/* Plan Name */}
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        <p className="text-slate-400 text-sm mb-6">{plan.tagline}</p>

                        {/* Price */}
                        <div className="mb-6">
                            {plan.custom ? (
                                <div>
                                    <div className="text-4xl font-bold text-white">Custom</div>
                                    <div className="text-slate-400 text-sm mt-1">Starting at $299/mo</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-white">
                                            ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.yearly / 12)}
                                        </span>
                                        <span className="text-slate-400">/month</span>
                                    </div>
                                    {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                                        <div className="text-sm text-green-400 mt-1">
                                            ${plan.price.yearly}/year - Save ${(plan.price.monthly * 12 - plan.price.yearly)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* CTA Button */}
                        <button
                            className={`w-full py-3 rounded-lg font-medium mb-6 transition-all flex items-center justify-center gap-2 ${plan.popular
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/50'
                                : plan.custom
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/50'
                                    : 'bg-slate-800 text-white hover:bg-slate-700'
                                }`}
                        >
                            {plan.id === 'bootstrap' ? 'Current Plan' : plan.custom ? 'Contact Sales' : 'Upgrade Now'}
                            {plan.id !== 'bootstrap' && <ArrowRight className="w-4 h-4" />}
                        </button>

                        {/* Features */}
                        <div className="space-y-3 mb-6">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <feature.icon className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300 text-sm">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Premium Badges */}
                        {plan.premiumBadges && (
                            <div className="border-t border-white/10 pt-6 mb-6">
                                <div className="text-xs font-bold text-indigo-400 mb-3">PREMIUM EXCLUSIVE</div>
                                <div className="flex flex-wrap gap-2">
                                    {plan.premiumBadges.map((badge, i) => (
                                        <div key={i} className="px-2 py-1 bg-indigo-500/20 rounded text-xs text-indigo-300">
                                            {badge}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Enterprise Badges */}
                        {plan.enterpriseBadges && (
                            <div className="border-t border-white/10 pt-6">
                                <div className="text-xs font-bold text-amber-400 mb-3">ENTERPRISE EXCLUSIVE</div>
                                <div className="flex flex-wrap gap-2">
                                    {plan.enterpriseBadges.map((badge, i) => (
                                        <div key={i} className="px-2 py-1 bg-amber-500/20 rounded text-xs text-amber-300">
                                            {badge}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Limitations */}
                        {plan.limitations && (
                            <div className="border-t border-white/10 pt-6 space-y-2">
                                {plan.limitations.map((limitation, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <X className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                        <span className="text-slate-500 text-sm">{limitation}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* ROI Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 text-center mb-16"
            >
                <h2 className="text-3xl font-bold text-white mb-4">
                    Premium Pays for Itself
                </h2>
                <p className="text-slate-400 max-w-3xl mx-auto mb-8">
                    Close just <span className="text-indigo-400 font-bold">one investor meeting</span> from our database,
                    or save <span className="text-purple-400 font-bold">10+ hours/week</span> with AI automation,
                    and Premium has already generated 10x ROI.
                </p>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="p-6 bg-slate-900/50 rounded-xl border border-white/10">
                        <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">3x</div>
                        <div className="text-sm text-slate-400">Higher funding success with AI pitches</div>
                    </div>
                    <div className="p-6 bg-slate-900/50 rounded-xl border border-white/10">
                        <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">10+ hrs/week</div>
                        <div className="text-sm text-slate-400">Saved with AI automation</div>
                    </div>
                    <div className="p-6 bg-slate-900/50 rounded-xl border border-white/10">
                        <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">500+</div>
                        <div className="text-sm text-slate-400">VCs in investor database</div>
                    </div>
                </div>
            </motion.div>

            {/* Trust Signals */}
            <div className="text-center">
                <div className="inline-flex items-center gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span>Secure payments via Stripe</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Cancel anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>14-day money-back guarantee</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
