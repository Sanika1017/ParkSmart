import { useEffect, useState } from "react";
import axios from "axios";
import StaffSidebar from "../components/StaffSidebar";
import VehicleEntryForm from "../components/VehicleEntryForm";
import VehicleExitForm from "../components/VehicleExitForm";

export default function StaffDashboard() {
  const [activePage, setActivePage] = useState("vehicles");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/staff/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data);
    } catch (err) {
      console.error("Vehicle fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === "vehicles") {
      fetchVehicles();
    }
  }, [activePage]);

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <StaffSidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="mb-10 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Staff <span className="text-indigo-600">Terminal</span>
              </h1>
              <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Real-time parking operations active
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-6 py-3 text-xs font-black tracking-widest text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm uppercase"
            >
              Secure Logout
            </button>
          </header>

          {/* Main Content Container */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex px-8 bg-slate-50/50 border-b border-slate-100">
              {["vehicles", "entry", "exit"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePage(tab)}
                  className={`relative px-8 py-6 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activePage === tab ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab === "vehicles" && "Live Inventory"}
                  {tab === "entry" && "Inbound"}
                  {tab === "exit" && "Outbound"}
                  {activePage === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activePage === "vehicles" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {loading ? (
                    <div className="py-20 text-center">
                      <div className="inline-block w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4" />
                      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Syncing Data...</p>
                    </div>
                  ) : vehicles.length === 0 ? (
                    <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium">No vehicles currently on record.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left">
                            <th className="pb-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Details</th>
                            <th className="pb-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                            <th className="pb-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fee Status</th>
                            <th className="pb-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Activity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {vehicles.map((v) => (
                            <tr key={v.id} className="group hover:bg-slate-50/80 transition-all duration-200">
                              <td className="py-5 px-4">
                                <div className="font-black text-slate-800 tracking-tighter text-lg">{v.vehicle_number}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Registered Entry</div>
                              </td>
                              <td className="py-5 px-4">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black tracking-wide uppercase">
                                  {v.vehicle_type.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-5 px-4 text-right">
                                <div className="font-black text-slate-900">₹{v.fee}</div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${v.payment_status === "PAID" ? "text-emerald-500" : "text-rose-500"}`}>
                                  {v.payment_status}
                                </span>
                              </td>
                              <td className="py-5 px-4 text-right text-xs font-bold text-slate-500">
                                {new Date(v.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activePage === "entry" && (
                <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-300">
                  <VehicleEntryForm onSuccess={fetchVehicles} />
                </div>
              )}

              {activePage === "exit" && (
                <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-300">
                  <VehicleExitForm onSuccess={fetchVehicles} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}