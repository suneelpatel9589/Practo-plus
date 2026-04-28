import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import {


  MapPin,
  Phone,
  User,
  CreditCard,
  ArrowLeft,
  PackageCheck,
} from "lucide-react";
import API from './../api';

function Checkout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const cart = JSON.parse(localStorage.getItem("medicine_cart") || "[]");
  

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name:
      `${savedUser.first_name || ""} ${savedUser.last_name || ""}`.trim() ||
      savedUser.username ||
      "",
    phone: savedUser.phone || "",
    address: "",
    city: "",
    pincode: "",
    payment_method: "COD",
  });

  const getCommissionPercent = (category) => {
    switch (category) {
      case "Medicines":
        return 8;
      case "Devices":
        return 12;
      case "Vitamins":
        return 15;
      case "Diabetes Care":
        return 10;
      case "Heart Health":
        return 10;
      default:
        return 10;
    }
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    [cart]
  );

  const { subtotal, commissionAmount, total } = useMemo(() => {
    let sub = 0;
    let commission = 0;

    cart.forEach((item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      const itemTotal = price * qty;
      const percent = getCommissionPercent(item.category);
      const itemCommission = (itemTotal * percent) / 100;

      sub += itemTotal;
      commission += itemCommission;
    });

    return {
      subtotal: Number(sub.toFixed(2)),
      commissionAmount: Number(commission.toFixed(2)),
      total: Number((sub + commission).toFixed(2)),
    };
  }, [cart]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function startRazorpayPayment({
    paymentId,
    token,
    title = "Medicine Service",
    description = "Medicine Order Payment",
    onSuccess,
  }) {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded, please try again later");
      return;
    }

    try {
      const orderRes = await API.post(
        "/payment-gateway/create-order/",
        { payment_id: paymentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderData = orderRes.data;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: title,
        description,
        order_id: orderData.razorpay_order_id,

        handler: async function (response) {
          try {
            const verifyRes = await API.post(
              "/payment-gateway/verify-payment/",
              {
                payment_id: paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (onSuccess) {
              onSuccess(verifyRes.data);
            }
          } catch (error) {
            console.error("Verify error:", error.response?.data || error.message);
            toast.error(
              error.response?.data?.error ||
                error.response?.data?.detail ||
                "payment not verified"
            );
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment process cancelled by user");
          },
        },

        theme: {
          color: "#0284c7",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(
        "Create Razorpay order error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Payment initiation failed"
      );
    }
  }

  async function placeOrder() {
    if (!token) {
      toast.error("Login required");
      navigate("/login");
      return;
    }

    if (
      !form.full_name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        full_name: form.full_name,
        phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.pincode}`,
        payment_method: form.payment_method,
        items: cart.map((item) => {
          const price = Number(item.price || 0);
          const quantity = Number(item.quantity || 1);
          const commission_percent = getCommissionPercent(item.category);

          return {
            medicine_name: item.name,
            category: item.category,
            quantity,
            price,
            commission_percent,
          };
        }),
      };

      const res = await axios.post(`${API_BASE}/orders/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (form.payment_method === "ONLINE") {
        const paymentId = res.data?.payment_id;

        if (!paymentId) {
          toast.error("Payment ID missing, cannot proceed to payment");
          return;
        }

        await startRazorpayPayment({
          paymentId,
          token,
          onSuccess: (data) => {
            localStorage.removeItem("medicine_cart");

            toast.success(
              `${data?.message || "Payment successful"}\nOrder successfully booked`
            );

            const orderId = res.data?.id;
            if (orderId) {
              navigate(`/receipt/${orderId}`);
            } else {
              navigate("/orders");
            }
          },
        });

        return;
      }

      localStorage.removeItem("medicine_cart");
      toast.success(res.data?.message || "Order successfully booked");

      const orderId = res.data?.id;
      if (orderId) {
        navigate(`/receipt/${orderId}`);
      } else {
        navigate("/orders");
      }
    } catch (error) {
      console.error("Order create error:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          error.response?.data?.items?.[0] ||
          "Order placement failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Checkout</h1>
          </div>

          <button
            onClick={() => navigate("/medicine")}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Medicines
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[30px] bg-white p-6 shadow-md ring-1 ring-slate-100">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <PackageCheck size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Delivery Details</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Full Name
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <User size={18} className="text-slate-400" />
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Phone
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Phone size={18} className="text-slate-400" />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Address
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <MapPin size={18} className="text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House no, street, area"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Payment Method
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <CreditCard size={18} className="text-slate-400" />
                <select
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="ONLINE">Online Payment</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-md ring-1 ring-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>

            <div className="mt-4 space-y-3">
              {cart.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Cart is empty.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold">{item.name}</h4>
                      <p className="truncate text-xs text-slate-500">{item.category}</p>
                      <p className="mt-1 text-sm font-bold">
                        ₹{item.price} x {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Commission</span>
                <span className="font-semibold text-orange-600">
                  ₹{commissionAmount.toFixed(2)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading || cart.length === 0}
                className="mt-4 w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : form.payment_method === "ONLINE"
                  ? "Pay & Place Order"
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;