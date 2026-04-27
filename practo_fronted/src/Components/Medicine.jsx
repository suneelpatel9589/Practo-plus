import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ShieldCheck,
} from "lucide-react";

export default function Medicine() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    { name: "All", icon: "🛍️", items: "All items" },
    { name: "Medicines", icon: "💊", items: "150+ items" },
    { name: "Devices", icon: "🩺", items: "80+ items" },
    { name: "Vitamins", icon: "🟠", items: "200+ items" },
    { name: "Diabetes Care", icon: "💉", items: "120+ items" },
    { name: "Heart Health", icon: "❤️", items: "80+ items" },
  ];

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

  const products = [
    {
      id: 1,
      name: "Dolo 650 Tablet",
      desc: "Fever & pain relief tablets",
      price: 35,
      oldPrice: 49,
      tag: "Best Seller",
      delivery: "20 min delivery",
      category: "Medicines",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      name: "Vitamin C Tablets",
      desc: "Daily immunity booster",
      price: 199,
      oldPrice: 249,
      tag: "20% OFF",
      delivery: "30 min delivery",
      category: "Vitamins",
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      name: "BP Monitor",
      desc: "Digital home health device",
      price: 1499,
      oldPrice: 1899,
      tag: "Top Rated",
      delivery: "Same day",
      category: "Devices",
      image:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      name: "Digital Thermometer",
      desc: "Fast temperature check",
      price: 299,
      oldPrice: 399,
      tag: "Trending",
      delivery: "Today delivery",
      category: "Devices",
      image:
        "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 5,
      name: "Diabetes Care Kit",
      desc: "Glucose monitoring essentials",
      price: 799,
      oldPrice: 999,
      tag: "Popular",
      delivery: "Same day",
      category: "Diabetes Care",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 6,
      name: "Omega 3 Capsules",
      desc: "Heart health support capsules",
      price: 349,
      oldPrice: 449,
      tag: "New",
      delivery: "25 min delivery",
      category: "Heart Health",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80",
    },

    // Added Medicines
    {
      id: 7,
      name: "Crocin Advance",
      desc: "Effective relief for fever and headache",
      price: 28,
      oldPrice: 38,
      tag: "Quick Relief",
      delivery: "20 min delivery",
      category: "Medicines",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 8,
      name: "Azee 500",
      desc: "Antibiotic medicine for bacterial infections",
      price: 115,
      oldPrice: 140,
      tag: "Doctor Choice",
      delivery: "30 min delivery",
      category: "Medicines",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 9,
      name: "Digene Gel",
      desc: "Acidity and indigestion relief syrup",
      price: 120,
      oldPrice: 145,
      tag: "Hot Deal",
      delivery: "25 min delivery",
      category: "Medicines",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 10,
      name: "Benadryl Syrup",
      desc: "Relief from cough and cold symptoms",
      price: 145,
      oldPrice: 170,
      tag: "Top Pick",
      delivery: "25 min delivery",
      category: "Medicines",
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 11,
      name: "Volini Spray",
      desc: "Fast pain relief spray for muscles and joints",
      price: 210,
      oldPrice: 245,
      tag: "Best Seller",
      delivery: "35 min delivery",
      category: "Medicines",
      image:
        "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 12,
      name: "ORS Sachets",
      desc: "Hydration support for weakness and dehydration",
      price: 85,
      oldPrice: 99,
      tag: "Essential",
      delivery: "20 min delivery",
      category: "Medicines",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
    },

    // Added Vitamins
    {
      id: 13,
      name: "Multivitamin Gummies",
      desc: "Daily nutritional support with fruity taste",
      price: 299,
      oldPrice: 349,
      tag: "Kids & Adults",
      delivery: "30 min delivery",
      category: "Vitamins",
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 14,
      name: "Vitamin D3 Capsules",
      desc: "Bone and immunity support",
      price: 259,
      oldPrice: 310,
      tag: "Daily Care",
      delivery: "30 min delivery",
      category: "Vitamins",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 15,
      name: "Calcium Tablets",
      desc: "Strong bones and teeth support",
      price: 189,
      oldPrice: 229,
      tag: "Healthy Bones",
      delivery: "30 min delivery",
      category: "Vitamins",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
    },

    // Added Devices
    {
      id: 16,
      name: "Pulse Oximeter",
      desc: "Check oxygen saturation and pulse rate",
      price: 899,
      oldPrice: 1099,
      tag: "Top Rated",
      delivery: "Same day",
      category: "Devices",
      image:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 17,
      name: "Nebulizer Machine",
      desc: "Respiratory care device for home use",
      price: 1799,
      oldPrice: 2199,
      tag: "Premium",
      delivery: "Same day",
      category: "Devices",
      image:
        "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=900&q=80",
    },

    // Added Diabetes Care
    {
      id: 18,
      name: "Glucometer Strips",
      desc: "Accurate blood sugar monitoring strips",
      price: 599,
      oldPrice: 699,
      tag: "Useful",
      delivery: "Today delivery",
      category: "Diabetes Care",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 19,
      name: "Sugar Free Protein Mix",
      desc: "Balanced nutrition for diabetic care",
      price: 425,
      oldPrice: 499,
      tag: "Healthy Choice",
      delivery: "Same day",
      category: "Diabetes Care",
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=900&q=80",
    },

    // Added Heart Health
    {
      id: 20,
      name: "CoQ10 Softgels",
      desc: "Heart wellness support supplement",
      price: 499,
      oldPrice: 599,
      tag: "Heart Care",
      delivery: "25 min delivery",
      category: "Heart Health",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 21,
      name: "Low Sodium Salt",
      desc: "Healthier salt option for heart-conscious diet",
      price: 149,
      oldPrice: 179,
      tag: "Healthy Pick",
      delivery: "20 min delivery",
      category: "Heart Health",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
    },
  ];

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("medicine_cart") || "[]");
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("medicine_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Number(item.quantity || 1) + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (product) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === product.id
            ? { ...item, quantity: Number(item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => Number(item.quantity || 1) > 0)
    );
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    [cart]
  );

  const { subtotal, commissionAmount, finalTotal } = useMemo(() => {
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
      subtotal: sub,
      commissionAmount: commission,
      finalTotal: sub + commission,
    };
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.desc.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 text-slate-900">
      <section className="px-4 pt-4 md:px-8 md:pt-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 shadow-xl">
          <div className="grid items-center gap-6 px-5 py-7 md:px-8 md:py-9 lg:grid-cols-2">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <ShieldCheck size={14} />
                Genuine Healthcare Store
              </div>

              <h1 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
                Order Medicines Online
              </h1>

              <p className="mt-3 max-w-lg text-sm text-sky-100 md:text-base">
                Fast delivery, genuine products aur easy ordering experience.
              </p>

              <div className="mt-5 flex gap-2 rounded-2xl bg-white p-2 shadow-lg">
                <div className="flex flex-1 items-center gap-2 px-2">
                  <Search size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search medicines, vitamins, devices..."
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

            <div className="flex justify-center lg:justify-end">
              <img
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80"
                alt="medicine"
                className="h-36 w-full max-w-sm rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((item) => {
            const active = activeCategory === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActiveCategory(item.name)}
                className={`rounded-[26px] border p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  active
                    ? "border-sky-200 bg-sky-50"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-3xl">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{item.items}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-sky-600">Featured Products</p>
            <h2 className="mt-1 text-2xl font-bold md:text-4xl">
              Popular medicines & health essentials
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <ShoppingCart size={18} className="text-sky-600" />
            <span className="text-sm font-semibold text-slate-700">
              Cart Items: {totalItems}
            </span>
          </div>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full rounded-[28px] bg-white p-10 text-center shadow-sm">
                <h3 className="text-xl font-semibold text-slate-800">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Search ya category change karke dobara try karo.
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const cartItem = cart.find((item) => item.id === product.id);
                const quantity = cartItem?.quantity || 0;

                return (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-40 overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                          {product.tag}
                        </span>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
                          {product.category}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-slate-800">
                        {product.name}
                      </h3>
                      <p className="mt-1 min-h-[40px] text-sm text-slate-500">
                        {product.desc}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-900">
                          ₹{product.price}
                        </span>
                        <span className="text-sm text-slate-400 line-through">
                          ₹{product.oldPrice}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-xs font-medium text-sky-700">
                          {product.delivery}
                        </p>

                        {quantity === 0 ? (
                          <button
                            onClick={() => addToCart(product)}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromCart(product)}
                              className="rounded-lg bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700"
                            >
                              -
                            </button>
                            <span className="min-w-[24px] text-center text-sm font-semibold">
                              {quantity}
                            </span>
                            <button
                              onClick={() => addToCart(product)}
                              className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700"
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

          <div className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm xl:sticky xl:top-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Order Summary</p>
                <h3 className="mt-1 text-xl font-bold">Selected Items ({totalItems})</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-2xl">
                💊
              </div>
            </div>

            <div className="mt-5 max-h-[340px] space-y-3 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  No medicines selected yet.
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
                <span className="text-slate-500">Commission</span>
                <span className="font-semibold text-orange-600">
                  ₹{commissionAmount.toFixed(2)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">₹{finalTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                disabled={cart.length === 0}
                className="mt-4 w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}