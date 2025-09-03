import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import CustomerListPage from "./pages/CustomerListPage";
import CustomerCreatePage from "./pages/CustomerCreatePage";
import CustomerDetailPage from "./pages/CustomerDetailPage";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Link to="/">Customers</Link>
        <Link to="/customers/new">Create Customer</Link>
      </header>

      <Routes>
        <Route path="/" element={<CustomerListPage />} />
        <Route path="/customers/new" element={<CustomerCreatePage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
