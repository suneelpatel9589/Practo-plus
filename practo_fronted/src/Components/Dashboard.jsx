import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Pill,
  FlaskConical,
  FileText,
  User,
  Mail,
  ShieldCheck,
  ArrowRight,
  HeartPulse,
  Sparkles,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function getUserName() {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    return fullName || user.name || user.username || "User";
  }

  function getInitials() {
    const name = getUserName().trim();
    if (!name) return "U";

    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";

    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }

  const services = [
    {
      title: "My Appointments",
      description: "Appointments is the section where you can view and manage all your upcoming and past doctor visits in one place.",
      icon: <CalendarDays size={24} />,
      iconWrap: "bg-sky-100 text-sky-600",
      buttonClass: "bg-sky-600 hover:bg-sky-700",
      onClick: () => navigate("/my-appointments"),
    },
    {
      title: "Medicines",
      description: "Medicine is the section where you can easily order medicines online and track your orders in real time.",
      icon: <Pill size={24} />,
      iconWrap: "bg-green-100 text-green-600",
      buttonClass: "bg-green-600 hover:bg-green-700",
      onClick: () => navigate("/orders"),
    },
    {
      title: "Lab Tests",
      description: "Lab Tests is the section where you can conveniently book tests online and access your test reports anytime.",
      icon: <FlaskConical size={24} />,
      iconWrap: "bg-purple-100 text-purple-600",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
      onClick: () => navigate("/labtest-orders"),
    },
    {
      title: "Health Records",
      description: "This section is used to store and manage all health records such as prescriptions, lab reports, and medical history",
      icon: <FileText size={24} />,
      iconWrap: "bg-orange-100 text-orange-600",
      buttonClass: "bg-orange-600 hover:bg-orange-700",
      onClick: () => navigate("/health-records"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-6 py-8 text-white md:px-8 md:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
              
                <h1 className="mt-4 text-3xl font-bold md:text-4xl">
                  Welcome back, {getUserName()}
                </h1>

               

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/my-appointments")}
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
                  >
                    My Appointments
                  </button>

                  <button
                    onClick={() => navigate("/doctors")}
                    className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-[28px] bg-white/10 p-4 backdrop-blur md:p-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-bold text-sky-700 shadow-lg">
                  {getInitials()}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-100">
                    Patient Profile
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{getUserName()}</h2>
                  <p className="mt-1 text-sm text-sky-50/90">
                    {user.email || "Email not found"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-[340px_1fr]">
            {/* Profile Card */}
            <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-md ring-1 ring-slate-100">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-2xl font-bold text-white shadow-lg">
                  {getInitials()}
                </div>

                <h3 className="mt-4 text-2xl font-bold text-slate-800">
                  {getUserName()}
                </h3>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
                  <ShieldCheck size={14} />
                  Active Patient Account
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <User size={16} />
                    <p className="text-xs">Full Name</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {getUserName()}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail size={16} />
                    <p className="text-xs">Email Address</p>
                  </div>
                  <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                    {user.email || "Email not found"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <HeartPulse size={16} />
                    <p className="text-xs">Account Role</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold uppercase text-slate-800">
                    {user.role || "PATIENT"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[28px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Profile Status
                  </p>
                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    Active
                  </p>
                 
                </div>

                <div className="rounded-[28px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Upcoming Appointment
                  </p>
                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    -- 
                  </p>
                 
                </div>

                <div className="rounded-[28px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Health Summary
                  </p>
                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    Updated
                  </p>
                
                </div>
              </div>

              {/* Services */}
              <div className="rounded-[30px] bg-white p-5 shadow-md ring-1 ring-slate-100 md:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      Health Services
                    </h3>
                  
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {services.map((service) => (
                    <div
                      key={service.title}
                      className="group rounded-[26px] border border-slate-100 bg-slate-50/70 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                    >
                      <div
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${service.iconWrap}`}
                      >
                        {service.icon}
                      </div>

                      <h4 className="text-lg font-bold text-slate-800">
                        {service.title}
                      </h4>

                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                        {service.description}
                      </p>

                      <button
                        onClick={service.onClick}
                        className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition ${service.buttonClass}`}
                      >
                        Open
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;