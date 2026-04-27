import {  HeartPulse, Mail, Phone, MapPin, Send } from "lucide-react";

function Footer() {
    return (

<footer className="relative bg-slate-950 text-white overflow-hidden">
  {/* background glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.14),transparent_28%)]" />

  <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
    {/* top section */}
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
      
      {/* brand */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-sky-500/15 border border-sky-400/20 flex items-center justify-center">
            <HeartPulse className="text-sky-400" size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Practo Care</h3>
            <p className="text-sm text-slate-400">Modern Healthcare Platform</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-slate-400 max-w-md">
          Book doctors, order medicines, manage lab tests, and access health
          records in one secure and modern platform built for convenience.
        </p>

      </div>

      {/* services */}
      <div>
        <h4 className="text-base font-semibold text-white mb-4">Services</h4>
        <ul className="space-y-3 text-sm text-slate-400">
          <li className="hover:text-white transition cursor-pointer">Doctor Booking</li>
          <li className="hover:text-white transition cursor-pointer">Medicine Delivery</li>
          <li className="hover:text-white transition cursor-pointer">Lab Tests</li>
          <li className="hover:text-white transition cursor-pointer">Health Records</li>
        </ul>
      </div>

      {/* company */}
      <div>
        <h4 className="text-base font-semibold text-white mb-4">Company</h4>
        <ul className="space-y-3 text-sm text-slate-400">
          <li className="hover:text-white transition cursor-pointer">About Us</li>
          <li className="hover:text-white transition cursor-pointer">Our Doctors</li>
          <li className="hover:text-white transition cursor-pointer">Privacy Policy</li>
          <li className="hover:text-white transition cursor-pointer">Terms & Conditions</li>
        </ul>
      </div>

      {/* contact + newsletter */}
      <div>
        <h4 className="text-base font-semibold text-white mb-4">Stay Connected</h4>

        <div className="space-y-3 text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-sky-400" />
            <span>suneelpatel9589@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-sky-400" />
            <span>+91 9589115046</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-sky-400" />
            <span>indrapuri bhopal</span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-white mb-3">
            Subscribe for health updates
          </p>
          <div className="flex items-center rounded-2xl bg-white/5 border border-white/10 p-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-500"
            />
            <button className="h-11 w-11 rounded-xl bg-sky-600 hover:bg-sky-700 transition flex items-center justify-center">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* bottom */}
    <div className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
      <p>© {new Date().getFullYear()} Practo. All rights reserved.</p>
      <div className="flex gap-5">
        <span className="hover:text-white transition cursor-pointer">Privacy</span>
        <span className="hover:text-white transition cursor-pointer">Terms</span>
        <span className="hover:text-white transition cursor-pointer">Support</span>
      </div>
    </div>
  </div>
</footer>
    )
}
export default Footer