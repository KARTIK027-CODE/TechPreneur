export default function FinancePage() {
    return (
        <div className="flex items-center justify-center h-[80vh] flex-col text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Finance Dashboard</h2>
            <p className="text-slate-400 mt-2 max-w-md">Track burn rate, expenses, and runway. Connect your bank account to get started.</p>
        </div>
    )
}
