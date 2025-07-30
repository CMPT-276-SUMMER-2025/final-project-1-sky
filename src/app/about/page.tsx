import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-slate-800">About Travelytics</h1>
            <p className="text-lg text-slate-600 mt-2">
              Your comprehensive Canadian city discovery platform
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                At Travelytics, our goal is to simplify your travel planning experience by combining smart technology with real-time weather data.
                Whether you&apos;re planning a weekend getaway or a cross-country adventure, we provide the insights you need to make the best decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Why Travelytics Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">Why Travelytics?</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-lg text-slate-700">Real-time weather data integration to help you avoid surprises</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-lg text-slate-700">Comprehensive city analytics and demographics</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-lg text-slate-700">Focus on Canadian cities with detailed local insights</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-lg text-slate-700">Historical weather trends and 5-day forecasts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">Meet the Team</h2>
              <p className="text-lg mb-6 text-slate-600 leading-relaxed">
                We&apos;re a team of students passionate about travel, technology, and building useful tools. 
                Travelytics was created as part of our software engineering project course.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  CJ
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Carter Jones</p>
                  <p className="text-sm text-slate-600">Quality Assurance Tester</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  AC
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Alex Chen</p>
                  <p className="text-sm text-slate-600">Project Manager</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  DS
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Daniel Shi</p>
                  <p className="text-sm text-slate-600">UI/UX Designer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  AB
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Ayden Badyal</p>
                  <p className="text-sm text-slate-600">API integration specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Built with Modern Technology
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Travelytics is developed in Next.js using Typescript. The platform uses GeoNames API for city data and OpenWeatherMap API for weather information.
              Our goal is to provide users with accurate and up-to-date information about Canadian cities and their weather.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}