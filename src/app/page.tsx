import { ComboboxForm } from "@/components/comboboxForm";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            {/* Main content container */}
            <div className="flex flex-col items-center space-y-8">
                {/* Title */}
                <div className="bg-gray-300 px-16 py-8 rounded-lg shadow-sm">
                    <h1 className="text-4xl font-bold text-black text-center">
                        Travelytics
                    </h1>
                    <p className="text-lg text-gray-700 text-center mt-2">
                        Discover Canadian cities with real-time weather and detailed analytics
                    </p>
                </div>
                
                {/* Form section */}
                <div className="flex items-center gap-4">
                    <ComboboxForm />
                </div>
            </div>
        </div>
    );
}