import React, { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";
import {
  ShoppingBag,
  RefreshCcw,
  Loader2,
  CreditCard,
  Package,
  CheckCircle2,
  Clock3,
  Search,
  Receipt,
  User,
  XCircle,
  BadgeCheck,
  Wallet,
  Truck,
  Box,
} from "lucide-react";
import API from "../api";

function AdminOrders() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusDrafts, setStatusDrafts] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchOrders() {
    try {
      setError("");
      orders.length === 0 ? setLoading(true) : setRefreshing(true);

      const res = await API.get("/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data);

      const draftMap = {};
      data.forEach((order) => {
        draftMap[order.id] = order.status || "PENDING";
      });
      setStatusDrafts(draftMap);
    } catch {
      setError("Failed to fetch orders");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function updateOrderStatus(orderId) {
    const nextStatus = statusDrafts[orderId];

    if (!nextStatus) {
      toast.error("Please select status");
      return;
    }

    try {
      setUpdatingId(orderId);

      await API.patch(
        `/orders/${orderId}/update-status/`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: nextStatus } : order
        )
      );

      toast.success(`Order ${orderId} updated successfully`);
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Order update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function formatStatus(text) {
    if (!text) return "N/A";
    return String(text).replaceAll("_", " ");
  }

  function getOrderStatusStyle(status) {
    const value = String(status || "").toUpperCase();

    if (value === "DELIVERED" || value === "PAID") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (value === "SHIPPED") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (value === "CANCELLED") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  function getPaymentStatusStyle(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (value === "FAILED") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  function getPaymentStatusIcon(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") return <CheckCircle2 size={12} />;
    if (value === "FAILED") return <XCircle size={12} />;
    return <Clock3 size={12} />;
  }

  function getPaymentTypeLabel(method) {
    const value = String(method || "").toUpperCase();

    if (value === "COD") return "Cash on Delivery";
    if (value === "ONLINE") return "Online Payment";
    return method || "N/A";
  }

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (!q) return true;

      return (
        String(order.id).includes(q) ||
        String(order.full_name || "").toLowerCase().includes(q) ||
        String(order.status || "").toLowerCase().includes(q) ||
        String(order.payment_status || "").toLowerCase().includes(q) ||
        String(order.payment_method || "").toLowerCase().includes(q) ||
        String(order.transaction_id || "").toLowerCase().includes(q) ||
        order.items?.some((item) =>
          String(item.medicine_name || "").toLowerCase().includes(q)
        )
      );
    });
  }, [orders, search]);

  const paidOrders = orders.filter(
    (order) => String(order.payment_status || "").toUpperCase() === "SUCCESS"
  ).length;

  const pendingPayments = orders.filter(
    (order) => String(order.payment_status || "").toUpperCase() === "PENDING"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => String(order.status || "").toUpperCase() === "DELIVERED"
  ).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.12),_transparent_34%),linear-gradient(to_bottom,_#f8fafc,_#eef2ff)] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-[30px] bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.30),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.24),_transparent_30%)]" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">
                <Wallet size={14} />
                Admin Panel
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Orders Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                Manage orders, payments, delivery status and medicines from one place.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              disabled={refreshing}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-slate-100 disabled:opacity-70"
            >
              {refreshing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RefreshCcw size={18} />
              )}
              {refreshing ? "Refreshing..." : "Refresh Orders"}
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              icon: <ShoppingBag size={22} />,
              color: "bg-slate-950",
            },
            {
              label: "Paid Orders",
              value: paidOrders,
              icon: <CheckCircle2 size={22} />,
              color: "bg-emerald-500",
            },
            {
              label: "Pending Payments",
              value: pendingPayments,
              icon: <Clock3 size={22} />,
              color: "bg-amber-500",
            },
            {
              label: "Delivered Orders",
              value: deliveredOrders,
              icon: <Truck size={22} />,
              color: "bg-violet-500",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm font-semibold text-slate-500">
                {item.label}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-black text-slate-950">
                  {item.value}
                </h2>

                <div className={`rounded-2xl p-3 text-white ${item.color}`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="relative w-full lg:max-w-lg">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer, payment, medicine..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-white/70 bg-white/90">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-sm font-bold">Loading orders...</span>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Receipt size={26} />
            </div>

            <h3 className="text-xl font-black text-slate-950">
              No orders found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredOrders.map((order) => (
              <article
                key={order.id}
                className="group rounded-[28px] border border-white/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl"
              >
                <div className="mb-4 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                      <Package size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="flex flex-wrap items-center gap-2 text-lg font-black text-slate-900">
                        Order
                        <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-sm font-bold text-indigo-700">
                          {order.id}
                        </span>
                      </h2>

                      <p className="mt-1 flex min-w-0 items-center gap-1 text-sm font-medium text-slate-500">
                        <User size={14} className="shrink-0" />
                        <span className="truncate">
                          {order.full_name || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getOrderStatusStyle(
                        order.status
                      )}`}
                    >
                      <BadgeCheck size={12} />
                      {formatStatus(order.status)}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getPaymentStatusStyle(
                        order.payment_status
                      )}`}
                    >
                      {getPaymentStatusIcon(order.payment_status)}
                      {formatStatus(order.payment_status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <InfoRow label="Customer" value={order.full_name || "N/A"} />

                  <InfoRow
                    label="Amount"
                    value={`₹${Number(order.total_amount || 0).toFixed(2)}`}
                  />

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="shrink-0 text-slate-500">
                      Payment Type
                    </span>

                    <span className="inline-flex min-w-0 items-center gap-1 font-bold text-slate-900">
                      <CreditCard size={14} className="shrink-0" />
                      <span className="truncate">
                        {getPaymentTypeLabel(order.payment_method)}
                      </span>
                    </span>
                  </div>

                  <InfoRow
                    label="Transaction ID"
                    value={order.transaction_id || "N/A"}
                  />
                </div>

                <div className="mt-4 rounded-3xl border border-sky-100 bg-sky-50/70 p-4">
                  <h3 className="mb-3 text-sm font-black text-slate-900">
                    Order Items
                  </h3>

                  <div className="space-y-2">
                    {order.items?.length ? (
                      order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm shadow-sm transition hover:shadow-md"
                        >
                          <span className="min-w-0 truncate font-medium text-slate-700">
                            {item.medicine_name || "Medicine"}
                          </span>

                          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-900">
                            x {item.quantity || 0}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm font-medium text-slate-500">
                        No items available
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    value={statusDrafts[order.id] || order.status || "PENDING"}
                    onChange={(e) =>
                      setStatusDrafts((prev) => ({
                        ...prev,
                        [order.id]: e.target.value,
                      }))
                    }
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <button
                    onClick={() => updateOrderStatus(order.id)}
                    disabled={updatingId === order.id}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white shadow-md transition hover:scale-[1.02] hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {updatingId === order.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Box size={16} />
                    )}

                    {updatingId === order.id ? "Updating..." : "Update"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="min-w-0 truncate text-right font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}

export default AdminOrders;