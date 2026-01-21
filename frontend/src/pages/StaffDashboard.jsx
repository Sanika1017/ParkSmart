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

  // 🔹 FETCH VEHICLES
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/staff/vehicles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVehicles(res.data);
    } catch (err) {
      console.error("Vehicle fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load vehicles when tab changes
  useEffect(() => {
    if (activePage === "vehicles") {
      fetchVehicles();
    }
  }, [activePage]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <StaffSidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">
                Staff Dashboard
              </h1>
              <p className="text-slate-500 mt-2">
                Manage parking operations efficiently
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600"
            >
              Logout
            </button>
          </header>

          {/* Content Box */}
          <div className="bg-white rounded-2xl shadow border">
            {/* Tab Header */}
            <div className="flex border-b bg-slate-50">
              {["vehicles", "entry", "exit"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePage(tab)}
                  className={`px-6 py-4 text-sm font-semibold ${
                    activePage === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-400"
                  }`}
                >
                  {tab === "vehicles" && "All Vehicles"}
                  {tab === "entry" && "Vehicle Entry"}
                  {tab === "exit" && "Vehicle Exit"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* 🚗 VEHICLE LIST */}
              {activePage === "vehicles" && (
                <>
                  {loading ? (
                    <p className="text-center text-slate-500">
                      Loading vehicles...
                    </p>
                  ) : vehicles.length === 0 ? (
                    <p className="text-center text-slate-500">
                      No vehicles found
                    </p>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-left text-sm">
                          <th className="p-3">Vehicle No</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Entry</th>
                          <th className="p-3">Exit</th>
                          <th className="p-3">Fee (₹)</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles.map((v) => (
                          <tr
                            key={v.id}
                            className="border-b text-sm hover:bg-slate-50"
                          >
                            <td className="p-3 font-semibold">
                              {v.vehicle_number}
                            </td>
                            <td className="p-3">{v.vehicle_type}</td>
                            <td className="p-3">
                              {new Date(v.entry_time).toLocaleString()}
                            </td>
                            <td className="p-3">
                              {v.exit_time
                                ? new Date(v.exit_time).toLocaleString()
                                : "—"}
                            </td>
                            <td className="p-3 font-bold">₹{v.fee}</td>
                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  v.payment_status === "PAID"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {v.payment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {/* ENTRY */}
              {activePage === "entry" && (
                <VehicleEntryForm onSuccess={fetchVehicles} />
              )}

              {/* EXIT */}
              {activePage === "exit" && (
                <VehicleExitForm onSuccess={fetchVehicles} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
