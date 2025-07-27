import { ComboboxForm } from "@/components/comboboxForm";
import Image from "next/image";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col items-center justify-center px-4">
            {/* Main content container */}
            <div className="flex flex-col items-center space-y-8">
                {/* Title section with logo */}
                <div className="bg-white/80 backdrop-blur-sm px-12 py-10 rounded-2xl shadow-xl border border-slate-200">
                    <div className="flex flex-col items-center space-y-4">
                        <Image 
                            src="/logo.png" 
                            alt="Travelytics Logo" 
                            width={280} 
                            height={80}
                            className="h-16 w-auto"
                        />
                        <p className="text-lg text-slate-600 text-center max-w-md leading-relaxed">
                            Discover Canadian cities with real-time weather and detailed analytics
                        </p>
                    </div>
                </div>
                
                {/* Form section */}
                <div className="flex items-center gap-4">
                    <ComboboxForm />
                </div>
            </div>
        </div>
    );
}