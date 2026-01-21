export default function StaffSidebar({ activePage, setActivePage }) {
  return (
    <div className="w-72 bg-slate-950 text-slate-300 flex flex-col min-h-screen border-r border-white/5">
      {/* Brand Logo / Section */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <span className="font-black text-xs">VP</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Staff<span className="text-blue-500">Panel</span>
          </h2>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
          Main Menu
        </p>

        <button
          onClick={() => setActivePage("entry")}
          className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
            activePage === "entry"
              ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
              : "hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className={`text-lg transition-transform duration-200 ${activePage === "entry" ? "scale-110" : "opacity-70"}`}>
            ➕
          </span>
          <span className="font-semibold text-sm">Vehicle Entry</span>
        </button>

        <button
          onClick={() => setActivePage("exit")}
          className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
            activePage === "exit"
              ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
              : "hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className={`text-lg transition-transform duration-200 ${activePage === "exit" ? "scale-110" : "opacity-70"}`}>
            🚗
          </span>
          <span className="font-semibold text-sm">Vehicle Exit</span>
        </button>

        <button
  onClick={() => setActivePage("vehicles")}
  className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
    activePage === "vehicles"
      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
      : "hover:bg-white/5 hover:text-white"
  }`}
>
  <span
    className={`text-lg transition-transform duration-200 ${
      activePage === "vehicles" ? "scale-110" : "opacity-70"
    }`}
  >
    📋
  </span>
  <span className="font-semibold text-sm">All Vehicles</span>
</button>

      </nav>

      {/* Bottom Profile/Footer Section */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 border border-white/10" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Staff Member</p>
            <p className="text-xs text-slate-500 truncate">Shift Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}