import React, { useEffect, useState } from "react";

import {
  Users,
  Stethoscope,
  CalendarDays,
  ShoppingBag,
  TestTubeDiagonal,
  IndianRupee,
  UserCheck,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";


function AdminDashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access") || localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await API.get("/admin-dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center">
          <h2 className="text-2xl text-red-400 font-bold">Access Denied</h2>
          <p className="text-slate-300 mt-2">Only admin can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-300 mt-4">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: data.total_users,
      icon: Users,
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Doctors",
      value: data.total_doctors,
      icon: Stethoscope,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Patients",
      value: data.total_patients,
      icon: UserCheck,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Appointments",
      value: data.total_appointments,
      icon: CalendarDays,
      color: "from-orange-500 to-amber-600",
    },
    {
      title: "Orders",
      value: data.total_orders,
      icon: ShoppingBag,
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Lab Bookings",
      value: data.total_lab_bookings,
      icon: TestTubeDiagonal,
      color: "from-cyan-500 to-sky-600",
    },
    {
      title: "Total Revenue",
      value: `₹${data.total_revenue}`,
      icon: IndianRupee,
      color: "from-green-500 to-emerald-600",
    },
  ];

  const commissions = [
    {
      title: "Doctor Commission",
      value: `₹${data.doctor_commission}`,
      color: "bg-orange-50 text-orange-700 border-orange-100",
    },
    {
      title: "Medicine Commission",
      value: `₹${data.medicine_commission}`,
      color: "bg-green-50 text-green-700 border-green-100",
    },
    {
      title: "Lab Commission",
      value: `₹${data.lab_commission}`,
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
  ];

  const actions = [
    ["Manage Doctors", "/admin-doctors", "bg-sky-600"],
    ["Manage Users", "/admin-users", "bg-emerald-600"],
    ["Orders", "/admin-orders", "bg-purple-600"],
    ["Lab Bookings", "/admin-lab-bookings", "bg-cyan-600"],
    ["Appointments", "/admin-appointments", "bg-orange-600"],
    ["Payments", "/payments", "bg-rose-600"],
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="relative overflow-hidden bg-slate-950 text-white p-7 md:p-9 rounded-[2rem] shadow-2xl">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-slate-200 mb-4">
                <ShieldCheck size={18} />
                Admin Control Panel
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                Welcome back, Admin
              </h1>

              <p className="text-slate-300 mt-3 max-w-xl">
                Manage doctors, users, orders, appointments, lab bookings and payments from one dashboard.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 min-w-[220px]">
              <p className="text-slate-300 text-sm flex items-center gap-2">
                <Wallet size={18} /> Total Revenue
              </p>
              <h2 className="text-3xl font-black mt-2">₹{data.total_revenue}</h2>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group bg-white p-5 rounded-[1.6rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      {item.title}
                    </p>
                    <h2 className="text-3xl font-black mt-2 text-slate-900">
                      {item.value}
                    </h2>
                  </div>

                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg`}>
                    <Icon size={22} />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                  <ArrowUpRight size={15} />
                  Updated live
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {commissions.map((item, index) => (
            <div
              key={index}
              className={`${item.color} border p-6 rounded-[1.6rem] shadow-sm`}
            >
              <p className="text-sm font-semibold opacity-80">{item.title}</p>
              <h2 className="text-3xl font-black mt-2">{item.value}</h2>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Activity className="text-sky-600" />
                Quick Actions
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Jump directly to important admin pages.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map(([label, path, color], index) => (
              <button
                key={index}
                onClick={() => navigate(path)}
                className={`${color} text-white p-5 rounded-2xl font-bold text-left shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between`}
              >
                {label}
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;