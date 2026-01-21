import { useState } from "react";
import axios from "axios";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessDeniedInfo, setAccessDeniedInfo] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setAccessDeniedInfo(null);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      onLoginSuccess(res.data.role);
    } catch (err) {
      const errData = err.response?.data;
      if (err.response?.status === 403 && errData?.accessDenied) {
        setAccessDeniedInfo({
          staffId: errData.staffId,
          message: errData.message || "Access not granted yet.",
        });
      } else {
        setError(errData?.message || "Invalid credentials or server error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!accessDeniedInfo?.staffId) return;
    try {
      await axios.post("http://localhost:5000/api/staff/request-access", {
        staffId: accessDeniedInfo.staffId,
      });
      setAccessDeniedInfo(null);
      setError("Request sent! Please wait for admin approval.");
    } catch {
      setError("Failed to send request. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-60 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-60" />

      <div className="w-full max-w-[28rem] z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-30 rounded-full"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[2rem] shadow-2xl mb-6 transform hover:rotate-12 transition-transform">
              <span className="text-white text-4xl font-black tracking-tighter">P</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Smart<span className="text-indigo-600">Park</span>
          </h1>
          <p className="text-slate-500 mt-3 font-semibold text-lg">
            System Authentication
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 ring-1 ring-black/5">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                Username
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-[1.5rem] font-black text-white tracking-widest uppercase text-xs shadow-lg shadow-indigo-200 transform transition-all active:scale-95 ${
                loading
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : "Login"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-black text-center animate-shake">
              {error}
            </div>
          )}

          {/* Access Denied / Request Approval Section */}
          {accessDeniedInfo && (
            <div className="mt-8 p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem] text-center">
              <p className="text-amber-800 text-xs font-bold leading-relaxed">
                {accessDeniedInfo.message}
              </p>
              <button
                onClick={handleRequestAccess}
                className="w-full mt-4 bg-white border border-amber-200 text-amber-600 font-black text-[10px] uppercase tracking-tighter py-3 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
              >
                Notify Administrator
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
          </div>
          <p className="text-slate-300 text-[10px] font-bold">
            © 2026 SMARTPARK ECOSYSTEMS V2.4
          </p>
        </div>
      </div>
    </div>
  );
}