import React, { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";
import {
  Wallet,
  Search,
  RefreshCcw,
  Loader2,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock3,
  IndianRupee,
  UserRound,
  BadgeCheck,
  ReceiptText,
} from "lucide-react";
import API from "../api";

function AdminPayments() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      payments.length === 0 ? setLoading(true) : setRefreshing(true);

      const res = await API.get("/payments/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to fetch payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function formatDate(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
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

  function getStatusStyle(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (value === "FAILED") return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  function getStatusIcon(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") return <CheckCircle2 size={12} />;
    if (value === "FAILED") return <XCircle size={12} />;
    return <Clock3 size={12} />;
  }

  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payments;

    return payments.filter((item) => {
      return (
        String(item.id).includes(q) ||
        String(item.payment_status || "").toLowerCase().includes(q) ||
        String(item.payment_method || "").toLowerCase().includes(q) ||
        String(item.payment_for || "").toLowerCase().includes(q) ||
        String(item.transaction_id || "").toLowerCase().includes(q) ||
        String(item.user_name || item.username || item.user || "").toLowerCase().includes(q)
      );
    });
  }, [payments, search]);

  const success = payments.filter((p) => String(p.payment_status || "").toUpperCase() === "SUCCESS").length;
  const pending = payments.filter((p) => String(p.payment_status || "").toUpperCase() === "PENDING").length;
  const totalAmount = payments
    .filter((p) => String(p.payment_status || "").toUpperCase() === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#eef2ff)] px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-2xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">
                <Wallet size={14} />
                Admin Payments
              </div>
              <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Payment Monitor</h1>
              <p className="mt-2 text-sm text-slate-300">View payment status, transactions, amount, and payment type.</p>
            </div>

            <button
              onClick={fetchPayments}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 disabled:opacity-60"
            >
              {refreshing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Success Payments" value={success} icon={<CheckCircle2 size={22} />} />
          <StatCard title="Pending Payments" value={pending} icon={<Clock3 size={22} />} />
          <StatCard title="Success Amount" value={`₹${totalAmount.toFixed(2)}`} icon={<IndianRupee size={22} />} />
        </section>

        <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payment, user, status, transaction..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </section>

        {loading ? (
          <LoadingBox text="Loading payments..." />
        ) : filteredPayments.length === 0 ? (
          <EmptyBox text="No payments found" />
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredPayments.map((item) => (
              <article key={item.id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Payment {item.id}</h2>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <ReceiptText size={14} />
                      {item.payment_for || "N/A"}
                    </p>
                  </div>

                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(item.payment_status)}`}>
                    {getStatusIcon(item.payment_status)}
                    {formatStatus(item.payment_status)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3">
                  <InfoRow icon={<UserRound size={14} />} label="User" value={item.user_name || item.username || item.user || "N/A"} />
                  <InfoRow icon={<IndianRupee size={14} />} label="Amount" value={`₹${Number(item.amount || 0).toFixed(2)}`} />
                  <InfoRow icon={<CreditCard size={14} />} label="Method" value={item.payment_method || "N/A"} />
                  <InfoRow icon={<BadgeCheck size={14} />} label="Transaction" value={item.transaction_id || "N/A"} />
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-emerald-50/40 p-3">
                  <p className="text-xs font-semibold text-slate-500">Linked IDs</p>
                  <div className="mt-2 grid gap-2 text-sm">
                    <SmallRow label="Appointment" value={item.appointment || item.appointment_id || "N/A"} />
                    <SmallRow label="Order" value={item.order || item.order_id || "N/A"} />
                    <SmallRow label="Lab Booking" value={item.lab_booking || item.lab_booking_id || "N/A"} />
                    <SmallRow label="Created" value={formatDate(item.created_at)} />
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{value}</h2>
        </div>
        <div className="rounded-2xl bg-slate-900 p-3 text-white">{icon}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm">
      <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </span>
      <span className="max-w-[150px] truncate text-right font-bold text-slate-900">{value}</span>
    </div>
  );
}

function SmallRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="max-w-[150px] truncate text-right text-xs font-bold text-slate-800">{value}</span>
    </div>
  );
}

function LoadingBox({ text }) {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-[28px] bg-white shadow-sm">
      <Loader2 className="animate-spin text-slate-600" size={28} />
      <span className="ml-3 text-sm font-semibold text-slate-600">{text}</span>
    </div>
  );
}

function EmptyBox({ text }) {
  return (
    <div className="rounded-[28px] bg-white p-10 text-center shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">{text}</h3>
    </div>
  );
}

export default AdminPayments;