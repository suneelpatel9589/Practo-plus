import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Labtest() {
  const navigate = useNavigate();
  const COMMISSION_RATE = 0.08;

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

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const categories = ["All", "Basic", "Blood", "Profile", "Diabetes", "Vitamins"];

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("labtest_cart") || "[]");
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("labtest_cart", JSON.stringify(cart));
  }, [cart]);

  const filteredTests = useMemo(() => {
    return tests.filter((item) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      const matchesCategory = category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const addToCart = (test) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === test.id);

      if (exists) {
        return prev.map((item) =>
          item.id === test.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
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
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity || 1) > 0)
    );
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

  const commission = useMemo(() => subtotal * COMMISSION_RATE, [subtotal]);
  const total = useMemo(() => subtotal + commission, [subtotal, commission]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pt-4 md:px-8 md:pt-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
          <div className="grid items-center gap-6 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-2">
            <div className="text-white">
              <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
                Book Lab Tests
              </h1>

              <p className="mt-2 max-w-lg text-xs text-cyan-50 sm:text-sm">
                Home sample collection, fast reports, and trusted diagnostic labs.
              </p>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search lab tests..."
                  className="w-full rounded-xl px-3 py-2 text-sm text-slate-900 outline-none"
                />
                <button className="rounded-xl bg-white px-4 text-sm font-medium text-sky-700">
                  Search
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80"
                alt="lab test"
                className="h-28 rounded-xl object-cover shadow-md sm:h-36 md:h-40"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                category === item
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTests.length === 0 ? (
              <div className="col-span-full rounded-[24px] bg-white p-10 text-center shadow-sm">
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
                    className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition hover:shadow-xl"
                  >
                    <div className="h-36 overflow-hidden bg-slate-100">
                      <img
                        src={test.image}
                        alt={test.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                          {test.tag}
                        </span>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
                          {test.category}
                        </span>
                      </div>

                      <h3 className="mt-3 text-base font-semibold">{test.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">{test.desc}</p>

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2 py-1">
                          Report: {test.report}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1">
                          {test.fasting}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xl font-bold">₹{test.price}</span>
                        <span className="text-sm text-slate-400 line-through">
                          ₹{test.oldPrice}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-medium text-sky-700">
                          Home collection
                        </p>

                        {quantity === 0 ? (
                          <button
                            onClick={() => addToCart(test)}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1">
                            <button
                              onClick={() => removeFromCart(test)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-base font-bold text-rose-600 hover:bg-rose-100"
                            >
                              {quantity === 1 ? "X" : "-"}
                            </button>

                            <span className="min-w-[24px] text-center text-sm font-semibold">
                              {quantity}
                            </span>

                            <button
                              onClick={() => addToCart(test)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-base font-bold text-emerald-600 hover:bg-emerald-100"
                            >
                              +
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

          <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm xl:sticky xl:top-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Booking Summary</p>
                <h3 className="mt-1 text-xl font-bold">
                  Selected Tests ({totalItems})
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-2xl">
                🧪
              </div>
            </div>

            <div className="mt-5 max-h-[340px] space-y-3 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  No lab tests selected yet.
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
                      <p className="truncate text-xs text-slate-500">
                        {item.report} report
                      </p>
                      <p className="mt-1 text-sm font-bold">
                        ₹{item.price} x {item.quantity || 1}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-base font-bold text-rose-600 hover:bg-rose-100"
                      >
                        {(item.quantity || 1) === 1 ? "🗑️" : "-"}
                      </button>

                      <span className="min-w-[20px] text-center text-sm font-semibold">
                        {item.quantity || 1}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-base font-bold text-emerald-600 hover:bg-emerald-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Commission (8%)</span>
                <span className="font-semibold text-orange-600">
                  ₹{commission.toFixed(2)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate("/labtest-checkout")}
                disabled={cart.length === 0}
                className="mt-4 w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Book Tests
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Labtest;