import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/superadmin/Dashboard";
import Branches from "./pages/superadmin/Branches";
import AdminUsers from "./pages/superadmin/AdminUsers";
import InventoryReport from "./pages/superadmin/InventoryReport";
import SystemSettings from "./pages/superadmin/SystemSettings";

import "./style.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <div className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/admins" element={<AdminUsers />} />
          <Route path="/inventory" element={<InventoryReport />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
