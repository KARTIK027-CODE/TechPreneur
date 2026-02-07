"use client";

import Link from "next/link";
import { ArrowRight, Rocket, Users, Target, BarChart, CheckCircle, Zap, Shield, Sparkles, FolderGit, MessageSquare, DollarSign, LineChart, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Background3D = dynamic(() => import("@/components/ui/background-3d"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-100 overflow-x-hidden selection:bg-indigo-500/30">
      <div className="absolute inset-0 z-0">
        <Background3D />
      </div>

      {/* Header */}
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between border-b border-white/5 backdrop-blur-xl bg-slate-950/20 sticky top-0 z-50">
        <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">FounderJourney</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          {["Product", "Departments", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} className="hover:text-indigo-400 transition-colors duration-200">
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-indigo-500/25 group"
          >
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-40">
          <div className="container mx-auto px-6 text-center max-w-5xl relative z-10">


            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
            >
              The Operating System <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x drop-shadow-2xl">
                for Startups.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              One workspace to rule them all. Manage Tech, Finance, Marketing, and HR in a single, collaborative platform. Like GitHub, but for your entire company.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-slate-200 transition-all shadow-[0_0_40px_-5px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Create Workspace <Rocket className="w-5 h-5" />
              </Link>
              <Link
                href="#departments"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Explore Departments
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Grid - Bento Box Style */}
        <section id="departments" className="py-32 relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">One Platform, Every Role</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">A dedicated workbench for every team.</h3>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Break down silos. Enable your Tech, Finance, and Marketing teams to calibrate on a single source of truth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Finance Core */}
              <div className="md:col-span-2 group p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-600/30 transition-colors"></div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">FinanceOS</h3>
                      <p className="text-slate-400 max-w-md">Track burn rate, manage equity cap tables, and automate expense approvals without leaving your workspace.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 relative h-40 w-full bg-slate-950/50 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                  <div className="w-full px-6 py-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>Monthly Recurring Revenue</span>
                      <span className="text-emerald-400">+12.5%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[75%]"></div>
                    </div>
                    <div className="mt-4 flex gap-4">
                      <div className="h-16 w-1/3 bg-slate-800/50 rounded-lg animate-pulse"></div>
                      <div className="h-16 w-1/3 bg-slate-800/50 rounded-lg animate-pulse delay-75"></div>
                      <div className="h-16 w-1/3 bg-slate-800/50 rounded-lg animate-pulse delay-100"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fundraising */}
              <div className="md:row-span-2 group p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-pink-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10 flex flex-col relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-pink-500/10 to-transparent -z-10"></div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Fundraising</h3>
                <p className="text-slate-400 mb-6">Direct investor connections. Host your pitch deck and share a secure data room link.</p>

                <div className="space-y-3 mt-auto">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">VC</div>
                      <div>
                        <div className="text-sm font-semibold text-white">Sequoia Capital</div>
                        <div className="text-xs text-slate-400">Has viewed your deck</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">YC</div>
                      <div>
                        <div className="text-sm font-semibold text-white">YCombinator</div>
                        <div className="text-xs text-green-400">Request for Meeting</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* HR & Hiring */}
              <FeatureCard
                icon={<Briefcase className="w-6 h-6 text-indigo-400" />}
                title="HR & Hiring"
                description="Manage your talent pipeline, onboarding checklists, and employee directory."
              />

              {/* Tech & Product */}
              <FeatureCard
                icon={<FolderGit className="w-6 h-6 text-blue-400" />}
                title="Tech & Product"
                description="Integrated roadmap planning. Sync with GitHub, Linear, and Jira automatically."
              />

              {/* Unified Collaboration */}
              <div className="md:col-span-2 md:col-start-2 group p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 flex items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-purple-500/10 to-transparent -z-10"></div>
                <div className="max-w-md">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Role-Based Access Control</h3>
                  <p className="text-slate-400">Give your marketing intern access to social calendars, but not your financial burn rate. Granular permissions built-in.</p>
                </div>
                <div className="hidden md:block">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold">
                        User {i}
                      </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs text-white font-bold cursor-pointer hover:bg-slate-600 transition-colors">
                      +12
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-slate-950/80 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-200">
            <Rocket className="w-5 h-5 text-indigo-500" />
            <span>FounderJourney</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 FounderJourney. Built for IIT Jammu Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  )

}
