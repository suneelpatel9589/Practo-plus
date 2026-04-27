import {

  ShieldCheck,
  Stethoscope,
  Pill,
  TestTube2,
  Star,
  Clock3,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
function Home() {
  const services = [
  {
    title: "Dentist",
    desc: "Teething troubles? Schedule a dental checkup",
    img: "Deni.jpg",
  },
  {
    title: "Gynecologist",
    desc: "Women's health & pregnancy consultation",
    img: "gyn.jpg",
  },
  {
    title: "Dietitian",
    desc: "Healthy eating & weight management",
    img: "dio.jpg",
  },
  {
    title: "Physiotherapist",
    desc: "Pain relief & therapy",
    img: "phy.jpg",
  },
  {
    title: "Cardiologist",
    desc: "Heart specialist consultation",
    img: "car.jpg",
  },
  {
    title: "Dermatologist",
    desc: "Skin & hair treatments",
    img: "der.jpg",
  },
  {
    title: "Neurologist",
    desc: "Brain & nervous system care",
    img: "neu.avif",
  },
  {
    title: "Orthopedic",
    desc: "Bone & joint specialist",
    img: "opt.jpg",
  },
];
  const navigate = useNavigate();
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.16),transparent_30%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              <ShieldCheck size={16} />
              Trusted Healthcare Platform
            </div>

            <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold ...">
              All your healthcare needs in
              <span className="block text-sky-600">one beautiful place</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl">
              Book doctors, order medicines, and schedule lab tests with a
              seamless digital healthcare experience built for speed, trust, and
              convenience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-sky-600 text-white px-7 py-3.5 rounded-2xl font-semibold hover:bg-sky-700 transition shadow-lg">
                Get Started
              </button>

              <button className="border border-slate-200 bg-white px-7 py-3.5 rounded-2xl font-semibold hover:bg-slate-50 transition">
                Explore Services
              </button>
            </div>

            {/* STATS */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ["150K+", "Doctors"],
                ["50K+", "Medicines"],
                ["500+", "Lab Tests"],
                ["4.8/5", "Ratings"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white bg-white/80 backdrop-blur-sm p-5 shadow-sm"
                >
                  <h3 className="text-2xl font-black text-slate-900">{value}</h3>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="absolute -inset-4 bg-sky-200/30 blur-3xl rounded-[2rem]" />
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80"
              alt="doctor"
              className="... w-full h-[400px] lg:h-[480px] object-cover rounded-2xl"
            />

            <div className="absolute bottom-6 left-6 right-6 bg-white/85 backdrop-blur-lg rounded-[1.5rem] p-5 shadow-xl border border-white/70">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Doctor Consult</p>
                  <h4 className="mt-1 font-bold text-slate-900">24/7 Access</h4>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Medicine Order</p>
                  <h4 className="mt-1 font-bold text-slate-900">Fast Delivery</h4>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Lab Booking</p>
                  <h4 className="mt-1 font-bold text-slate-900">Home Collection</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="inline-flex rounded-full bg-sky-50 border border-sky-200 px-4 py-2 text-sm font-medium text-sky-700">
              Our Services
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4">
              Everything you need for better care
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Access doctors, medicines, and diagnostic services from one
              modern platform designed to make healthcare simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition bg-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50">
                <Stethoscope className="text-sky-600" size={30} />
              </div>
              <h3 className="text-2xl font-bold mt-5">Doctor Booking</h3>
              <p className="text-slate-500 mt-3 leading-7">
                Find and consult top doctors online or offline with easy
                appointment scheduling.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 text-sky-700 font-semibold">
                Learn more <ArrowRight size={16} />
              </button>
            </div>

            <div className="p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition bg-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50">
                <Pill className="text-sky-600" size={30} />
              </div>
              <h3 className="text-2xl font-bold mt-5">Medicine Delivery</h3>
              <p className="text-slate-500 mt-3 leading-7">
                Order daily medicines and wellness essentials with fast delivery
                at your doorstep.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 text-sky-700 font-semibold">
                Learn more <ArrowRight size={16} />
              </button>
            </div>

            <div className="p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition bg-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50">
                <TestTube2 className="text-sky-600" size={30} />
              </div>
              <h3 className="text-2xl font-bold mt-5">Lab Tests</h3>
              <p className="text-slate-500 mt-3 leading-7">
                Book diagnostic tests with trusted labs and home sample
                collection support.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 text-sky-700 font-semibold">
                Learn more <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / DOCTOR SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=80"
              className="rounded-[2rem] shadow-2xl w-full h-[520px] object-cover"
              alt="hospital"
            />
          </div>
              

          <div>
            <p className="inline-flex rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
              Why choose us
            </p>

            <h2 className="text-4xl sm:text-4xl font-black mt-5 text-slate-900 leading-tight">
              Healthcare made simple, trusted and accessible
            </h2>

            <p className="mt-5 text-slate-600 leading-8">
              Our platform connects patients with doctors, pharmacies, and labs
              in one seamless experience. Designed with modern UI, faster
              access, and patient trust in mind.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Easy doctor booking across multiple specialties",
                "Fast medicine delivery with trusted pharmacy support",
                "Lab test booking with home sample collection",
                "Secure digital records and prescriptions",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="text-emerald-500 mt-0.5" size={20} />
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="inline-flex rounded-full bg-sky-50 border border-sky-200 px-4 py-2 text-sm font-medium text-sky-700">
              Platform Highlights
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mt-4">
              Designed for a premium healthcare experience
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-[2rem] bg-slate-900 text-white p-8 shadow-xl">
              <HeartPulse size={34} className="text-sky-300" />
              <h3 className="mt-5 text-2xl font-bold">Trusted Care</h3>
              <p className="mt-3 text-slate-300 leading-7">
                Verified doctors and reliable health services for complete peace
                of mind.
              </p>
            </div>

            <div className="rounded-[2rem] bg-sky-600 text-white p-8 shadow-xl">
              <Clock3 size={34} className="text-white" />
              <h3 className="mt-5 text-2xl font-bold">Fast Booking</h3>
              <p className="mt-3 text-sky-100 leading-7">
                Appointments, medicine orders, and lab tests in just a few
                clicks.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <Star size={34} className="text-amber-500" />
              <h3 className="mt-5 text-2xl font-bold text-slate-900">
                Best Experience
              </h3>
              <p className="mt-3 text-slate-600 leading-7">
                Smooth and responsive UI that feels modern, clean, and easy to
                use.
              </p>
            </div>
          </div>
        </div>
      </section>

 <section className="px-6 md:px-12 py-16 bg-white">
  <div className="text-center mb-10">
    <h2 className="text-3xl md:text-4xl font-bold">Our Medical Services</h2>
    <p className="text-gray-600 mt-3">
      Choose from a wide range of healthcare specialties
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {services.map((item, index) => (
      <div
        key={index}
        className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
      >
        <img
          src={item.img}
          alt={item.title}
          loading="lazy"
          width="300"
          height="180"
          className="h-28 w-full object-cover"
        />

        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>
      {/* BIG CTA */}
<section className="py-14 bg-slate-100 border-t border-slate-200">
  <div className="max-w-6xl mx-auto px-6">

    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

      {/* LEFT */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Take control of your health today
        </h2>
        <p className="mt-1 text-sm text-slate-600 max-w-md">
          Book doctors, order medicines, and schedule lab tests — all in one place.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex gap-3">
        <button onClick={() => navigate("/login")} className="bg-sky-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-sky-700 transition">
          Get Started
        </button>

        <button className="border border-slate-300 px-5 py-2.5 rounded-lg font-medium hover:bg-white transition">
          Learn More
        </button>
      </div>

    </div>

  </div>
</section>
    </div>
  );
}

export default Home;