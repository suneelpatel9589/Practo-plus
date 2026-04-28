import { Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import Sign from "./Components/Sign";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import DoctorPage from "./Components/Doctor";

import Medicine from "./Components/Medicine";
import Labtest from "./Components/Labtest";

import AddDoctor from "./Components/Adddoctor";
import DoctorDashboard from "./Components/DoctorDashboard";
import EditDoctor from "./Components/EditDoctor";
import Appoiment from "./Components/Appoiment";
import MyAppointments from "./Components/MyAppointments";
import DoctorAppointments from "./Components/DoctorAppointments";

import Checkout from "./Components/Checkout";
import Orders from "./Components/Orders";
import Receipt from "./Components/Receipt";

import LabtestCheckout from "./Components/LabtestCheckout";
import LabtestOrders from "./Components/LabtestOrders";
import LabtestReceipt from "./Components/LabtestReceipt";

import AdminDoctors from "./Components/AdminDoctors";
import AdminUsers from "./Components/AdminUsers";
import AdminOrders from "./Components/AdminOrders";
import AdminDashboard from "./Components/AdminDashboard";
import MyAppointmentReceipt from "./Components/MyAppointmentReceipt";
import HealthRecord from "./Components/HealthRecord";
import AdminAppointments from './Components/AdminAppointments';
import AdminLabBookings from "./Components/AdminLabBookings";
import AdminPayments from "./Components/AdminPayments";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/doctors/" element={<DoctorPage />} />

        <Route path="/medicine" element={<Medicine />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/receipt/:id" element={<Receipt />} />

        <Route path="/labtest" element={<Labtest />} />
        <Route path="/labtest-checkout" element={<LabtestCheckout />} />
        <Route path="/labtest-orders" element={<LabtestOrders />} />
        <Route path="/labtest-receipt/:id" element={<LabtestReceipt />} />

        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/edit-doctor/:id" element={<EditDoctor />} />
        <Route path="/appoiment" element={<Appoiment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
        <Route path="/admin-doctors" element={<AdminDoctors />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/appointment-receipt/:id" element={<MyAppointmentReceipt />} />
        <Route path="/health-records" element={<HealthRecord />} />
        <Route path="/admin-appointments" element={<AdminAppointments />} />
        <Route path="/admin-lab-bookings" element={<AdminLabBookings />} />
        <Route path="/payments" element={<AdminPayments />} />
      </Routes>

      <Footer />
<ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
    </>
  );
}

export default App;