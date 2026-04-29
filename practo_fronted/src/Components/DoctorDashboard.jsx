import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  UserRound,
  BriefcaseMedical,
  IndianRupee,
  FileText,
  Pencil,
  Stethoscope,
  BadgeCheck,
  Sparkles,
  CalendarDays,
  Clock3,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  FlaskConical,
  TestTubeDiagonal,
  Activity,
  ClipboardList,
} from "lucide-react";

function DoctorDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("access") || localStorage.getItem("token");

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [labBookings, setLabBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [labActionLoading, setLabActionLoading] = useState({});

  const authConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  useEffect(() => {
    if (!user?.id || !token) {
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, [user?.id, token]);

  async function fetchDashboardData() {
    try {
      const [doctorRes, appointmentRes, labBookingRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/doctors/"),
        axios.get("http://127.0.0.1:8000/appointments/", authConfig),
        axios.get("http://127.0.0.1:8000/lab-orders/", authConfig),
      ]);

      const myDoctor = (doctorRes.data || []).find(
        (item) => String(item.user) === String(user.id)
      );

      setDoctor(myDoctor || null);
      setAppointments(appointmentRes.data || []);
      setLabBookings(labBookingRes.data || []);
    } catch (error) {
      toast.error("Dashboard data load failed");
    } finally {
      setLoading(false);
    }
  }

  const topAppointments = useMemo(() => {
    return [...appointments]
      .sort(
        (a, b) =>
          new Date(a.appointment_date).getTime() -
          new Date(b.appointment_date).getTime()
      )
      .slice(0, 5);
  }, [appointments]);

  const topLabBookings = useMemo(() => {
    return [...labBookings]
      .sort(
        (a, b) =>
          new Date(b.booking_date || b.created_at).getTime() -
          new Date(a.booking_date || a.created_at).getTime()
      )
      .slice(0, 5);
  }, [labBookings]);

  const pendingAppointmentsCount = useMemo(
    () =>
      appointments.filter(
        (item) => String(item.status || "").toUpperCase() === "PENDING"
      ).length,
    [appointments]
  );

  const pendingLabCount = useMemo(
    () =>
      labBookings.filter((item) =>
        ["BOOKED", "SAMPLE_COLLECTED", "PROCESSING"].includes(
          String(item.status || "BOOKED").toUpperCase()
        )
      ).length,
    [labBookings]
  );

  const commissionPercent = 7;

  const doctorFeeSummary = useMemo(() => {
    const fee = Number(doctor?.consultation_fee || 0);
    const commission = (fee * commissionPercent) / 100;
    const doctorReceives = fee - commission;

    return {
      fee: fee.toFixed(2),
      commission: commission.toFixed(2),
      doctorReceives: doctorReceives.toFixed(2),
    };
  }, [doctor]);

  function formatDateTime(dateTime) {
    if (!dateTime) return "N/A";

    return new Date(dateTime).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatStatus(status) {
    if (!status) return "N/A";
    return String(status).replaceAll("_", " ");
  }

  function getStatusClasses(status) {
    const s = String(status || "").toUpperCase();

    if (s === "CANCELLED") {
      return "bg-red-50 text-red-700 border-red-200";
    }
    if (s === "CONFIRMED" || s === "COMPLETED" || s === "BOOKED") {
      return "bg-green-50 text-green-700 border-green-200";
    }
    if (s === "SAMPLE_COLLECTED" || s === "PROCESSING") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }

  async function updateAppointmentStatus(id, actionType) {
    const actionMap = {
      confirm: "confirm",
      cancel: "cancel",
      complete: "complete",
    };

    const statusMap = {
      confirm: "CONFIRMED",
      cancel: "CANCELLED",
      complete: "COMPLETED",
    };

    try {
      setActionLoading((prev) => ({ ...prev, [id]: actionType }));

      const res = await axios.patch(
        `http://127.0.0.1:8000/appointments/${id}/${actionMap[actionType]}/`,
        {},
        authConfig
      );

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: statusMap[actionType] } : item
        )
      );

      toast.success(res.data?.message || "Appointment status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Appointment status update failed"
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  async function updateLabBookingStatus(id, newStatus) {
    const ok = window.confirm(`Update status to ${formatStatus(newStatus)}?`);
    if (!ok) return;

    try {
      setLabActionLoading((prev) => ({ ...prev, [id]: newStatus }));

      const res = await axios.patch(
        `http://127.0.0.1:8000/lab-orders/${id}/update-status/`,
        { status: newStatus },
        authConfig
      );

      setLabBookings((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: res.data?.status || newStatus }
            : item
        )
      );

      toast.success(res.data?.message || "Lab booking status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Lab booking status update failed"
      );
    } finally {
      setLabActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-6 text-center shadow-xl">
          <h2 className="text-xl font-bold text-red-600">Login Required</h2>
        </div>
      </div>
    );
  }

  if (user?.role?.toUpperCase() !== "DOCTOR") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-6 text-center shadow-xl">
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-28 rounded-[30px] bg-white/80 shadow-lg" />
          <div className="mt-6 grid gap-6 xl:grid-cols-[320px_1fr]">
            <div className="h-96 rounded-[30px] bg-white/80 shadow-lg" />
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="h-28 rounded-[24px] bg-white/80 shadow-lg" />
                <div className="h-28 rounded-[24px] bg-white/80 shadow-lg" />
                <div className="h-28 rounded-[24px] bg-white/80 shadow-lg" />
                <div className="h-28 rounded-[24px] bg-white/80 shadow-lg" />
              </div>
              <div className="h-36 rounded-[28px] bg-white/80 shadow-lg" />
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="h-[520px] rounded-[28px] bg-white/80 shadow-lg" />
                <div className="h-[520px] rounded-[28px] bg-white/80 shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-8">
        <div className="mx-auto max-w-md rounded-[30px] bg-white p-7 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 text-sky-600">
            <Stethoscope size={28} />
          </div>
          <button
            onClick={() => navigate("/add-doctor")}
            className="mt-6 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Add Doctor Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-5 py-6 text-white sm:px-7 sm:py-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  <Sparkles size={14} />
                  Doctor Panel
                </div>

                <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Welcome, {doctor.doctor_name || user.username}
                </h1>

                <p className="mt-2 text-sm text-cyan-50/90">
                  Manage appointments and lab bookings in one place
                </p>
              </div>

              <button
                onClick={() => navigate(`/edit-doctor/${doctor.id}`)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[320px_1fr]">
            <div className="self-start rounded-[28px] border border-slate-100 bg-slate-50/70 p-6 shadow-sm xl:sticky xl:top-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-32 w-32 overflow-hidden rounded-full bg-white shadow-md ring-4 ring-white">
                  {doctor.image ? (
                    <img
                      src={
                        doctor.image.startsWith("http")
                          ? doctor.image
                          : `http://127.0.0.1:8000/media/${doctor.image}`
                      }
                      alt={doctor.doctor_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <UserRound size={48} />
                    </div>
                  )}
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-800">
                  {doctor.doctor_name || "Doctor"}
                </h2>

                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold text-sky-700">
                  <BriefcaseMedical size={14} />
                  {doctor.specialization || "Specialist"}
                </div>

                <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <BadgeCheck size={16} className="text-green-600" />
                  Verified Doctor Account
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs text-slate-400">Experience</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {doctor.experience} Years
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs text-slate-400">Consultation Fee</p>
                  <p className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold text-slate-800">
                    <IndianRupee size={14} />
                    {doctorFeeSummary.fee}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs text-slate-400">Platform Commission (7%)</p>
                  <p className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold text-red-600">
                    <IndianRupee size={14} />
                    {doctorFeeSummary.commission}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs text-slate-400">Doctor Receives</p>
                  <p className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold text-green-700">
                    <IndianRupee size={14} />
                    {doctorFeeSummary.doctorReceives}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs text-slate-400">Username</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {user.username}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <button
                  onClick={() => navigate(`/edit-doctor/${doctor.id}`)}
                  className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Update Profile
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                >
                  Back to Home
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[24px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Appointments
                    </p>
                    <CalendarDays size={18} className="text-sky-600" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    {appointments.length}
                  </p>
                </div>

                <div className="rounded-[24px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Pending Appointments
                    </p>
                    <ClipboardList size={18} className="text-amber-600" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    {pendingAppointmentsCount}
                  </p>
                </div>

                <div className="rounded-[24px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Lab Bookings
                    </p>
                    <TestTubeDiagonal size={18} className="text-cyan-600" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    {labBookings.length}
                  </p>
                </div>

                <div className="rounded-[24px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Active Lab Orders
                    </p>
                    <Activity size={18} className="text-green-600" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    {pendingLabCount}
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                <div className="mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-sky-600" />
                  <h3 className="text-lg font-bold text-slate-800">Bio</h3>
                </div>
                <p className="text-sm leading-7 text-slate-600">
                  {doctor.bio || "Bio not available."}
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[28px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} className="text-sky-600" />
                      <h3 className="text-lg font-bold text-slate-800">
                        Recent Appointments
                      </h3>
                    </div>

                    <button
                      onClick={() => navigate("/doctor-appointments")}
                      className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                    >
                      View All
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {topAppointments.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                      Appointment not available
                    </div>
                  ) : (
                    <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                      {topAppointments.map((item) => {
                        const status = String(item.status || "PENDING").toUpperCase();
                        const isBusy = !!actionLoading[item.id];
                        const canTakeAction = status === "PENDING";

                        return (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">
                                    Appointment {item.id}
                                  </p>
                                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                    <Clock3 size={14} />
                                    {formatDateTime(item.appointment_date)}
                                  </p>
                                </div>

                                <span
                                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                    status
                                  )}`}
                                >
                                  {formatStatus(status)}
                                </span>
                              </div>

                              <p className="text-sm text-slate-500">
                                {item.symptoms || "No symptoms added"}
                              </p>

                              {canTakeAction && (
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() =>
                                      updateAppointmentStatus(item.id, "confirm")
                                    }
                                    disabled={isBusy}
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isBusy && actionLoading[item.id] === "confirm" ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      <CheckCircle2 size={14} />
                                    )}
                                    Confirm
                                  </button>

                                  <button
                                    onClick={() =>
                                      updateAppointmentStatus(item.id, "cancel")
                                    }
                                    disabled={isBusy}
                                    className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isBusy && actionLoading[item.id] === "cancel" ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      <XCircle size={14} />
                                    )}
                                    Cancel
                                  </button>
                                </div>
                              )}

                              {status === "CONFIRMED" && (
                                <button
                                  onClick={() =>
                                    updateAppointmentStatus(item.id, "complete")
                                  }
                                  disabled={isBusy}
                                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isBusy && actionLoading[item.id] === "complete" ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <CheckCircle2 size={14} />
                                  )}
                                  Complete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-[28px] bg-white p-5 shadow-md ring-1 ring-slate-100">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TestTubeDiagonal size={18} className="text-cyan-600" />
                      <h3 className="text-lg font-bold text-slate-800">
                        Recent Lab Bookings
                      </h3>
                    </div>

                    <button
                      onClick={() => navigate("/labtest-orders")}
                      className="inline-flex items-center gap-2 rounded-2xl bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                    >
                      View All
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {topLabBookings.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                      No lab booking available
                    </div>
                  ) : (
                    <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                      {topLabBookings.map((item) => {
                        const status = String(item.status || "BOOKED").toUpperCase();
                        const currentLabAction = labActionLoading[item.id];
                        const canUpdateLab = !["COMPLETED", "CANCELLED"].includes(status);

                        return (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">
                                    Lab Booking {item.id}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    Patient: {item.full_name || "Unknown"}
                                  </p>
                                  {item.doctor_name && (
                                    <p className="mt-1 text-sm text-slate-600">
                                      Doctor: {item.doctor_name}
                                    </p>
                                  )}
                                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                    <Clock3 size={14} />
                                    {formatDateTime(item.booking_date || item.created_at)}
                                  </p>
                                </div>

                                <span
                                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                    status
                                  )}`}
                                >
                                  {formatStatus(status)}
                                </span>
                              </div>

                              <p className="text-sm text-slate-500">
                                {item.address || "No address"}
                              </p>

                              {item.items?.length > 0 && (
                                <div className="space-y-2">
                                  {item.items.map((test, index) => (
                                    <div
                                      key={index}
                                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700"
                                    >
                                      {test.test_name || test.name || "Lab Test"} x{" "}
                                      {test.quantity || 1}
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="text-sm font-semibold text-slate-700">
                                ₹{Number(item.total_amount || 0).toFixed(2)}
                              </div>

                              {canUpdateLab && (
                                <div className="flex flex-wrap gap-2">
                                  {status === "BOOKED" && (
                                    <button
                                      onClick={() =>
                                        updateLabBookingStatus(
                                          item.id,
                                          "SAMPLE_COLLECTED"
                                        )
                                      }
                                      disabled={!!currentLabAction}
                                      className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {currentLabAction === "SAMPLE_COLLECTED" ? (
                                        <Loader2 size={14} className="animate-spin" />
                                      ) : (
                                        <FlaskConical size={14} />
                                      )}
                                      Sample Collected
                                    </button>
                                  )}

                                  {status === "SAMPLE_COLLECTED" && (
                                    <button
                                      onClick={() =>
                                        updateLabBookingStatus(item.id, "PROCESSING")
                                      }
                                      disabled={!!currentLabAction}
                                      className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {currentLabAction === "PROCESSING" ? (
                                        <Loader2 size={14} className="animate-spin" />
                                      ) : (
                                        <FlaskConical size={14} />
                                      )}
                                      Processing
                                    </button>
                                  )}

                                  {status === "PROCESSING" && (
                                    <button
                                      onClick={() =>
                                        updateLabBookingStatus(item.id, "COMPLETED")
                                      }
                                      disabled={!!currentLabAction}
                                      className="inline-flex w-fit items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {currentLabAction === "COMPLETED" ? (
                                        <Loader2 size={14} className="animate-spin" />
                                      ) : (
                                        <CheckCircle2 size={14} />
                                      )}
                                      Completed
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;