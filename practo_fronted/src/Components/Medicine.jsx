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

export default function Medicine() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openCart, setOpenCart] = useState(false);

  const categories = [
    { name: "All", icon: "🛍️", items: "All items" },
    { name: "Medicines", icon: "💊", items: "150+ items" },
    { name: "Devices", icon: "🩺", items: "80+ items" },
    { name: "Vitamins", icon: "🟠", items: "200+ items" },
    { name: "Diabetes Care", icon: "💉", items: "120+ items" },
    { name: "Heart Health", icon: "❤️", items: "80+ items" },
  ];

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
  ];

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("medicine_cart") || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem("medicine_cart", JSON.stringify(cart));
  }, [cart]);

  const getCommissionPercent = (category) => {
    if (category === "Medicines") return 8;
    if (category === "Devices") return 12;
    if (category === "Vitamins") return 15;
    return 10;
  };

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

      return [...prev, { ...product, quantity: 1 }];
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

  const deleteItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    [cart]
  );

  const { subtotal, commissionAmount, finalTotal } = useMemo(() => {
    let sub = 0;
    let commission = 0;

    cart.forEach((item) => {
      const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);
      sub += itemTotal;
      commission += (itemTotal * getCommissionPercent(item.category)) / 100;
    });

    return {
      subtotal: sub,
      commissionAmount: commission,
      finalTotal: sub + commission,
    };
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = search.trim().toLowerCase();

      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.desc.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

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

            <div className="relative flex justify-center lg:justify-end">
              
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
            <p className="font-semibold text-sky-600">Featured Products</p>
            <h2 className="mt-1 text-2xl font-bold md:text-4xl">
              Popular medicines & health essentials
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
                  className="group overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-emerald-700 shadow">
                      {product.tag}
                    </span>
                  </div>

                  <div className="p-4">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
                      {product.category}
                    </span>

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
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition active:scale-95"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
                          <button
                            onClick={() => removeFromCart(product)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-rose-600 shadow-sm"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-[24px] text-center text-sm font-bold">
                            {quantity}
                          </span>

                          <button
                            onClick={() => addToCart(product)}
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
              <p className="text-xs text-slate-300">{totalItems} items</p>
              <p className="text-lg font-extrabold">₹{finalTotal.toFixed(2)}</p>
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
              <p className="text-sm text-slate-500">Your Cart</p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {totalItems} Items
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
                <div className="text-5xl">🛒</div>
                <h4 className="mt-3 font-bold">Cart is empty</h4>
                <p className="mt-1 text-sm text-slate-500">
                  Add medicines to continue.
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
                    <p className="text-xs text-slate-500">{item.category}</p>
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
                <span className="text-slate-500">Commission</span>
                <span className="font-bold text-orange-600">
                  ₹{commissionAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-extrabold">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 py-3 font-bold text-white shadow-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to Checkout
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