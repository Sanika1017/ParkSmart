import { useState } from "react";
import axios from "axios";

export default function VehicleExitForm({ onSuccess }) {
  const [vehicleNo, setVehicleNo] = useState("");
  const [fee, setFee] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastProcessed, setLastProcessed] = useState("");

  const token = localStorage.getItem("token");

  const handleExit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFee(null);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/staff/vehicle/exit",
        { vehicleNumber: vehicleNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setFee(res.data.fee);
      setLastProcessed(vehicleNo);
      setMessage(`Checkout complete for ${vehicleNo}`);
      setVehicleNo("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Vehicle not found or already exited");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      {/* Visual Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl mb-4 shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Exit Terminal</h2>
        <p className="text-slate-500 font-medium">Finalize session & collect payment</p>
      </div>

      {!fee ? (
        /* --- SEARCH FORM --- */
        <form onSubmit={handleExit} className="space-y-6 animate-in fade-in duration-500">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Search Plate Number
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="MH 12 AB 1234"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-black text-xl placeholder:text-slate-300 tracking-wider"
                required
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                🔍
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-white tracking-[0.2em] uppercase text-xs shadow-xl transition-all active:scale-[0.98] ${
              loading
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-slate-900 hover:bg-black shadow-slate-200"
            }`}
          >
            {loading ? "Calculating..." : "Calculate Parking Fee"}
          </button>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center animate-in shake">
              ⚠️ {error}
            </div>
          )}
        </form>
      ) : (
        /* --- BILLING SUMMARY CARD --- */
        <div className="animate-in zoom-in-95 duration-300">
          <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16" />
            
            <div className="relative z-10 text-center">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                Payment Due
              </span>
              <h3 className="text-5xl font-black text-slate-900 mt-4 mb-1 italic">
                ₹{fee}
              </h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-tighter">
                Plate: <span className="text-slate-600">{lastProcessed}</span>
              </p>

              <div className="mt-8 pt-6 border-t border-slate-200 border-dashed space-y-3">
                <button
                  onClick={() => setFee(null)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-100"
                >
                  Confirm & Clear Gate
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}