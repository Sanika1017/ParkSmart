import { useState } from "react";
import StaffSidebar from "../components/StaffSidebar";
import VehicleEntryForm from "../components/VehicleEntryForm";
import VehicleExitForm from "../components/VehicleExitForm";

export default function StaffDashboard() {
  const [activePage, setActivePage] = useState("entry");

  const handleLogout = () => {
    localStorage.clear(); // remove token + role
    window.location.href = "/"; // redirect to login
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <StaffSidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Staff Dashboard
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Manage vehicle flow and parking logs efficiently.
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-sm transition-all active:scale-95"
            >
              Logout
            </button>
          </header>

          {/* Dynamic Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tab Indicator */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <div
                className={`px-6 py-4 text-sm font-semibold ${
                  activePage === "entry"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-400"
                }`}
              >
                {activePage === "entry"
                  ? "Vehicle Entry Registration"
                  : "Vehicle Exit Processing"}
              </div>
            </div>

            <div className="p-8">
              {activePage === "entry" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <VehicleEntryForm />
                </div>
              )}

              {activePage === "exit" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <VehicleExitForm />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}