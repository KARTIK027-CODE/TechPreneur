import { Rocket } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-background relative">
                <div className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl">
                    <Link href="/" className="flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-primary" />
                        <span>FounderJourney</span>
                    </Link>
                </div>
                <div className="w-full max-w-sm space-y-8">
                    {children}
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-col bg-muted text-muted-foreground p-12 justify-center relative overlow-hidden">
                <div className="relative z-10 max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-bounce delay-700">
                        <Rocket className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">Turn your vision into reality.</h2>
                    <p className="text-lg">
                        "The best way to predict the future is to create it." <br />
                        <span className="text-sm opacity-70">- Peter Drucker</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
