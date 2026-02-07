export default function MarketingPage() {
    return (
        <div className="flex items-center justify-center h-[80vh] flex-col text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Marketing Dashboard</h2>
            <p className="text-slate-400 mt-2 max-w-md">Manage campaigns, social media calendars, and track ROI across channels.</p>
        </div>
    )
}
