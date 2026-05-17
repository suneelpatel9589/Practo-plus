import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ShieldCheck,
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

export default function Labtest() {
  const navigate = useNavigate();

  const COMMISSION_RATE = 0.08;

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openCart, setOpenCart] = useState(false);

  const categories = [
    { name: "All", icon: "🧪", items: "All tests" },
    { name: "Basic", icon: "📋", items: "Basic tests" },
    { name: "Blood", icon: "🩸", items: "Blood tests" },
    { name: "Profile", icon: "🧬", items: "Health profiles" },
    { name: "Diabetes", icon: "💉", items: "Sugar tests" },
    { name: "Vitamins", icon: "☀️", items: "Vitamin tests" },
  ];

  const tests = [
    {
      id: 1,
      name: "CBC (Complete Blood Count)",
      desc: "Checks overall health and blood disorders",
      price: 299,
      oldPrice: 399,
      tag: "Popular",
      report: "24 hrs",
      fasting: "No fasting",
      category: "Blood",
      image:
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      name: "Blood Sugar (Fasting)",
      desc: "Measures fasting glucose level in blood",
      price: 199,
      oldPrice: 249,
      tag: "Best Seller",
      report: "12 hrs",
      fasting: "Fasting required",
      category: "Diabetes",
      image:
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      name: "HbA1c Test",
      desc: "Monitors average blood sugar for diabetes care",
      price: 399,
      oldPrice: 499,
      tag: "Diabetes Care",
      report: "24 hrs",
      fasting: "No fasting",
      category: "Diabetes",
      image:
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      name: "Lipid Profile",
      desc: "Measures cholesterol and heart health",
      price: 499,
      oldPrice: 599,
      tag: "Heart Care",
      report: "24 hrs",
      fasting: "Fasting required",
      category: "Profile",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 5,
      name: "Thyroid Profile (T3, T4, TSH)",
      desc: "Checks thyroid hormone levels",
      price: 549,
      oldPrice: 699,
      tag: "Essential",
      report: "24 hrs",
      fasting: "No fasting",
      category: "Profile",
      image:
        "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 6,
      name: "Liver Function Test (LFT)",
      desc: "Assesses liver health and enzyme levels",
      price: 599,
      oldPrice: 749,
      tag: "Recommended",
      report: "24 hrs",
      fasting: "No fasting",
      category: "Profile",
      image:
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 7,
      name: "Kidney Function Test (KFT)",
      desc: "Evaluates kidney health and filtration function",
      price: 649,
      oldPrice: 799,
      tag: "Health Check",
      report: "24 hrs",
      fasting: "No fasting",
      category: "Profile",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 8,
      name: "Vitamin D Test",
      desc: "Detects vitamin D deficiency",
      price: 699,
      oldPrice: 899,
      tag: "Trending",
      report: "36 hrs",
      fasting: "No fasting",
      category: "Vitamins",
      image:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 9,
      name: "Vitamin B12 Test",
      desc: "Checks energy and nerve health",
      price: 749,
      oldPrice: 899,
      tag: "Care",
      report: "36 hrs",
      fasting: "No fasting",
      category: "Vitamins",
      image:
        "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 10,
      name: "Urine Routine Test",
      desc: "Detects infection, sugar and kidney issues",
      price: 149,
      oldPrice: 199,
      tag: "Basic",
      report: "12 hrs",
      fasting: "No fasting",
      category: "Basic",
      image:
        "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 11,
      name: "Dengue NS1 Antigen",
      desc: "Early detection test for dengue infection",
      price: 899,
      oldPrice: 1099,
      tag: "Seasonal",
      report: "24 hrs",
      fasting: "No fasting",
      category: "Blood",
      image:
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 12,
      name: "CRP Test",
      desc: "Measures inflammation and infection markers",
      price: 449,
      oldPrice: 549,
      tag: "Useful",
      report: "18 hrs",
      fasting: "No fasting",
      category: "Blood",
      image:
        "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=900&q=80",
    },
  ];

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("labtest_cart") || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem("labtest_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (test) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === test.id);

      if (exists) {
        return prev.map((item) =>
          item.id === test.id
            ? { ...item, quantity: Number(item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prev, { ...test, quantity: 1 }];
    });
  };

  const removeFromCart = (test) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === test.id
            ? { ...item, quantity: Number(item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => Number(item.quantity || 1) > 0)
    );
  };

  const deleteItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const commission = useMemo(
    () => subtotal * COMMISSION_RATE,
    [subtotal]
  );

  const total = useMemo(
    () => subtotal + commission,
    [subtotal, commission]
  );

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const q = search.trim().toLowerCase();

      const matchesCategory =
        activeCategory === "All" || test.category === activeCategory;

      const matchesSearch =
        !q ||
        test.name.toLowerCase().includes(q) ||
        test.desc.toLowerCase().includes(q) ||
        test.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 pb-28 text-slate-900 md:pb-8">
      <section className="px-4 pt-4 md:px-8 md:pt-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 shadow-xl">
          <div className="grid items-center gap-6 px-5 py-7 md:px-8 md:py-9 lg:grid-cols-2">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <ShieldCheck size={14} />
                Trusted Diagnostic Labs
              </div>

              <h1 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
                Book Lab Tests Online
              </h1>

              <p className="mt-3 max-w-lg text-sm text-sky-100 md:text-base">
                Home sample collection, fast reports aur trusted lab testing.
              </p>

              <div className="mt-5 flex gap-2 rounded-2xl bg-white p-2 shadow-lg">
                <div className="flex flex-1 items-center gap-2 px-2">
                  <Search size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search CBC, thyroid, diabetes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </div>

                <button className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
                  Search
                </button>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <img
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80"
                alt="lab test"
                className="h-36 w-full max-w-sm rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {categories.map((item) => {
            const active = activeCategory === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActiveCategory(item.name)}
                className={`rounded-[26px] border p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  active
                    ? "border-sky-300 bg-sky-50 ring-2 ring-sky-100"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="text-3xl">{item.icon}</div>
                <h3 className="mt-3 font-bold text-slate-800">{item.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{item.items}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-sky-600">Featured Lab Tests</p>
            <h2 className="mt-1 text-2xl font-bold md:text-4xl">
              Popular health tests & profiles
            </h2>
          </div>

          <button
            onClick={() => setOpenCart(true)}
            className="hidden items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-xl transition hover:-translate-y-1 md:flex"
          >
            <ShoppingCart size={18} />
            <span className="text-sm font-bold">Cart: {totalItems}</span>
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTests.length === 0 ? (
            <div className="col-span-full rounded-[28px] bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">
                No tests found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Search ya category change karke dobara try karo.
              </p>
            </div>
          ) : (
            filteredTests.map((test) => {
              const cartItem = cart.find((item) => item.id === test.id);
              const quantity = cartItem?.quantity || 0;

              return (
                <div
                  key={test.id}
                  className="group overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={test.image}
                      alt={test.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-emerald-700 shadow">
                      {test.tag}
                    </span>
                  </div>

                  <div className="p-4">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
                      {test.category}
                    </span>

                    <h3 className="mt-3 text-lg font-bold text-slate-800">
                      {test.name}
                    </h3>

                    <p className="mt-1 min-h-[40px] text-sm text-slate-500">
                      {test.desc}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        Report: {test.report}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        {test.fasting}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xl font-bold text-slate-900">
                        ₹{test.price}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        ₹{test.oldPrice}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-sky-700">
                        Home collection
                      </p>

                      {quantity === 0 ? (
                        <button
                          onClick={() => addToCart(test)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition active:scale-95"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
                          <button
                            onClick={() => removeFromCart(test)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-rose-600 shadow-sm"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-[24px] text-center text-sm font-bold">
                            {quantity}
                          </span>

                          <button
                            onClick={() => addToCart(test)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white shadow-sm"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-white">
            <div>
              <p className="text-xs text-slate-300">{totalItems} tests</p>
              <p className="text-lg font-extrabold">₹{total.toFixed(2)}</p>
            </div>

            <button
              onClick={() => setOpenCart(true)}
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {openCart && (
        <div
          onClick={() => setOpenCart(false)}
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed z-50 bg-white shadow-2xl transition-transform duration-300
        bottom-0 right-0 h-[85vh] w-full rounded-t-[32px]
        md:top-0 md:h-full md:w-[420px] md:rounded-none
        ${
          openCart
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-x-full md:translate-y-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <p className="text-sm text-slate-500">Selected Lab Tests</p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {totalItems} Tests
              </h3>
            </div>

            <button
              onClick={() => setOpenCart(false)}
              className="rounded-2xl bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="rounded-[28px] bg-slate-50 p-8 text-center">
                <div className="text-5xl">🧪</div>
                <h4 className="mt-3 font-bold">Cart is empty</h4>
                <p className="mt-1 text-sm text-slate-500">
                  Add lab tests to continue.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-[24px] border border-slate-100 bg-white p-3 shadow-sm transition hover:shadow-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold">{item.name}</h4>
                    <p className="text-xs text-slate-500">
                      {item.report} report
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      ₹{item.price} × {item.quantity || 1}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => removeFromCart(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-rose-600"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="min-w-[22px] text-center text-sm font-bold">
                      {item.quantity || 1}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700"
                    >
                      <Plus size={14} />
                    </button>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 bg-white p-5">
            <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Commission 8%</span>
                <span className="font-bold text-orange-600">
                  ₹{commission.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-extrabold">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/labtest-checkout")}
              disabled={cart.length === 0}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 py-3 font-bold text-white shadow-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Book Tests
            </button>

            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="mt-3 w-full rounded-2xl bg-rose-50 py-3 font-bold text-rose-600 transition hover:bg-rose-100"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}