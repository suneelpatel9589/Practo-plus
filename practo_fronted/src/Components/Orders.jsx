import React, { useEffect, useMemo, useState } from "react";
import {
  Package,
  CalendarDays,
  IndianRupee,
  ReceiptText,
  CreditCard,
  CheckCircle2,
  Clock3,
  Search,
  RefreshCcw,
  Loader2,
  BadgeCheck,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";

function Orders() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = String(user.role || "").toUpperCase() === "ADMIN";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusLoading, setStatusLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      if (orders.length === 0) setLoading(true);
      else setRefreshing(true);

      const res = await API.get("/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Orders fetch error:", error.response?.data || error.message);
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function updateOrderStatus(id, status) {
    const ok = window.confirm(`Order ${formatStatus(status)} karna hai?`);
    if (!ok) return;

    try {
      setStatusLoading(`${id}-${status}`);

      const res = await API.patch(
        `/orders/${id}/update_status/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: res.data?.status || status } : order
        )
      );

      toast.success(res.data?.message || "Order status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Status update failed"
      );
    } finally {
      setStatusLoading(null);
    }
  }

  function formatStatus(text) {
    if (!text) return "N/A";
    return String(text).replaceAll("_", " ");
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

  function getOrderStatusColor(status) {
    const value = String(status || "").toUpperCase();

    if (value === "PAID") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (value === "SHIPPED") return "bg-blue-50 text-blue-700 border-blue-200";
    if (value === "DELIVERED") return "bg-green-50 text-green-700 border-green-200";
    if (value === "CANCELLED") return "bg-rose-50 text-rose-700 border-rose-200";
    if (value === "PENDING_PAYMENT") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  }

  function getPaymentStatusColor(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (value === "FAILED") return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  function getPaymentStatusIcon(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") return <CheckCircle2 size={13} />;
    if (value === "FAILED") return <XCircle size={13} />;
    return <Clock3 size={13} />;
  }

  function getPaymentTypeLabel(method) {
    const value = String(method || "").toUpperCase();

    if (value === "COD") return "CASH ON DELIVERY";
    if (value === "ONLINE") return "ONLINE";
    return method || "N/A";
  }

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((order) => {
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.10),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#eef2ff)] px-3 py-4 sm:px-4 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-500 px-4 py-5 text-white sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {isAdmin ? "All Orders" : "My Orders"}
                </h1>
              </div>

              <button
                onClick={fetchOrders}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-md disabled:opacity-70"
              >
                {refreshing ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <RefreshCcw size={15} />
                )}
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="mb-4 relative max-w-md">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search order, medicine, payment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {loading ? (
              <div className="rounded-[20px] bg-slate-50 p-8 text-center text-slate-600">
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-[20px] bg-slate-50 p-8 text-center">
                <h3 className="text-lg font-semibold text-slate-800">No orders found</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try adjusting your search or refresh the list.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => {
                  const subtotal = Number(order.subtotal_amount || 0);
                  const commission = Number(order.commission_amount || 0);
                  const pharmacyPayout = Number(order.pharmacy_payout || 0);
                  const totalAmount = Number(order.total_amount || 0);
                  const status = String(order.status || "").toUpperCase();

                  const userCanCancel =
                    !isAdmin &&
                    status !== "DELIVERED" &&
                    status !== "CANCELLED" &&
                    status !== "SHIPPED";

                  return (
                    <div
                      key={order.id}
                      className="rounded-[20px] border border-slate-200 bg-gradient-to-br from-white to-sky-50/40 p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-base sm:text-lg font-bold text-slate-800">
                              Order {order.id}
                            </h3>

                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${getOrderStatusColor(
                                  order.status
                                )}`}
                              >
                                <BadgeCheck size={13} />
                                Order: {formatStatus(order.status)}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${getPaymentStatusColor(
                                  order.payment_status
                                )}`}
                              >
                                {getPaymentStatusIcon(order.payment_status)}
                                Payment: {formatStatus(order.payment_status)}
                              </span>
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">Order Date</p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <CalendarDays size={14} />
                                {formatDate(order.created_at)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">Payment Type</p>
                              <div className="mt-1 flex flex-col gap-1">
                                <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                  <CreditCard size={14} />
                                  {getPaymentTypeLabel(order.payment_method)}
                                </p>
                              </div>
                            </div>

                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">Commission</p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-orange-600">
                                <IndianRupee size={14} />
                                {commission.toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-900 p-3">
                              <p className="text-[11px] text-slate-300">Grand Total</p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
                                <IndianRupee size={14} />
                                {totalAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">Subtotal</p>
                              <p className="mt-1 text-sm font-semibold text-slate-800">
                                ₹{subtotal.toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">Pharmacy Payout</p>
                              <p className="mt-1 text-sm font-semibold text-green-700">
                                ₹{pharmacyPayout.toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">Transaction ID</p>
                              <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                                {order.transaction_id || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                            <p className="text-[11px] text-slate-400">Address</p>
                            <p className="mt-1 text-sm text-slate-700">
                              {order.address || "No address"}
                            </p>
                          </div>

                          {isAdmin && (
                            <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <button
                                onClick={() => updateOrderStatus(order.id, "SHIPPED")}
                                disabled={
                                  statusLoading === `${order.id}-SHIPPED` ||
                                  status === "SHIPPED" ||
                                  status === "DELIVERED" ||
                                  status === "CANCELLED"
                                }
                                className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {statusLoading === `${order.id}-SHIPPED`
                                  ? "Updating..."
                                  : "Shipped"}
                              </button>

                              <button
                                onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                                disabled={
                                  statusLoading === `${order.id}-DELIVERED` ||
                                  status === "DELIVERED" ||
                                  status === "CANCELLED"
                                }
                                className="rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {statusLoading === `${order.id}-DELIVERED`
                                  ? "Updating..."
                                  : "Delivered"}
                              </button>

                              <button
                                onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                                disabled={
                                  statusLoading === `${order.id}-CANCELLED` ||
                                  status === "DELIVERED" ||
                                  status === "CANCELLED"
                                }
                                className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {statusLoading === `${order.id}-CANCELLED`
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-3 lg:w-[120px] lg:flex-col lg:items-end">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                            <Package size={20} />
                          </div>

                          <button
                            onClick={() => navigate(`/receipt/${order.id}`)}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white"
                          >
                            <ReceiptText size={15} />
                            Receipt
                          </button>

                          {userCanCancel && (
                            <button
                              onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                              disabled={statusLoading === `${order.id}-CANCELLED`}
                              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle size={15} />
                              {statusLoading === `${order.id}-CANCELLED`
                                ? "Cancelling..."
                                : "Cancel"}
                            </button>
                          )}
                        </div>
                      </div>

                      {order.items?.length > 0 && (
                        <div className="mt-4 rounded-2xl bg-slate-50 p-3.5">
                          <h4 className="mb-3 text-sm font-bold text-slate-800">
                            Ordered Items
                          </h4>

                          <div className="space-y-2.5">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col gap-1.5 rounded-xl bg-white px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {item.medicine_name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {item.category || "Medicine"} • Qty: {item.quantity}
                                  </p>
                                </div>

                                <div className="text-left sm:text-right">
                                  <p className="text-sm font-semibold text-slate-800">
                                    ₹{Number(item.price || 0).toFixed(2)}
                                  </p>
                                  <p className="text-xs text-orange-600">
                                    Comm: {Number(item.commission_percent || 0)}%
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;