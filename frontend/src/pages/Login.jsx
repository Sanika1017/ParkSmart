import { useState } from "react";
import axios from "axios";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessDeniedInfo, setAccessDeniedInfo] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
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

      setMessage(`${res.data.role === "admin" ? "Admin" : "Staff"} login successful ✅`);

      setTimeout(() => {
        onLoginSuccess(res.data.role);
      }, 800);
    } catch (err) {
      const errData = err.response?.data;

      if (err.response?.status === 403 && errData?.accessDenied) {
        setAccessDeniedInfo({
          staffId: errData.staffId,
          message: errData.message || "Access hasn't been granted yet.",
        });
        setError(""); 
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
      setMessage("Request sent! Please wait for admin approval.");
      setAccessDeniedInfo(null);
    } catch (err) {
      setError("Failed to send request. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />

      <div className="w-full max-w-[26rem] z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 mb-4">
            <span className="text-white text-2xl font-black">P</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 font-medium">Secure Parking Management System</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] shadow-lg ${
                loading 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Feedback Messages */}
          {message && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-bold text-center animate-in fade-in zoom-in-95">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-bold text-center animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}

          {/* Access Denied / Request Section */}
          {accessDeniedInfo && (
            <div className="mt-6 p-5 bg-amber-50 border border-amber-100 rounded-[1.5rem] animate-in slide-in-from-top-4 duration-300">
              <p className="text-amber-800 text-sm font-semibold text-center leading-relaxed">
                {accessDeniedInfo.message}
              </p>
              <button
                type="button"
                onClick={handleRequestAccess}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-amber-200"
              >
                Request Approval
              </button>
            </div>
          )}
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          © 2026 SmartPark Systems • Support
        </p>
      </div>
    </div>
  );
}