import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B0F19] text-[#F8FAFC] flex flex-col items-center justify-center font-sans px-4 relative overflow-hidden">
      {/* Background decoration grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>

      <div className="max-w-2xl w-full text-center z-10 flex flex-col items-center gap-6">
        {/* Brand Icon & Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-sm font-semibold text-[#60A5FA] shadow-sm">
          <span>🏥</span>
          <span>Agnos CareSync Portal</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-tight mt-2">
          Real-Time Patient <br />
          <span className="text-[#3B82F6]">Registration & Monitoring</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed">
          Welcome to Agnos CareSync. Choose your access portal below to start registering patients or tracking registration sessions in real-time.
        </p>

        {/* Portal Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mt-6">
          {/* Patient Link */}
          <Link
            href="/patient"
            className="flex flex-col items-center justify-center p-6 bg-[#0a82c7] hover:bg-[#086da8] text-white rounded-2xl shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
          >
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">📝</span>
            <span className="font-bold text-base tracking-wide">Patient Registration</span>
            <span className="text-xs text-blue-100/70 mt-1 text-center">Fill out the patient form and sync live</span>
          </Link>

          {/* Staff Link */}
          <Link
            href="/staff"
            className="flex flex-col items-center justify-center p-6 bg-[#1E293B] hover:bg-[#334155] text-white rounded-2xl shadow-lg border border-slate-800 hover:border-slate-700 transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
          >
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🖥️</span>
            <span className="font-bold text-base tracking-wide">Staff Dashboard</span>
            <span className="text-xs text-slate-400 mt-1 text-center">Monitor active sessions and logs in real-time</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-12">
          Powered by Next.js & Pusher WebSockets
        </div>
      </div>
    </div>
  );
}
