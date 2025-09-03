import React, { useState } from "react";

export default function AddressForm({ onAdd }) {
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pinCode: "",
    isPrimary: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.street.trim() || !form.city.trim() || !form.state.trim() || !form.pinCode.trim()) {
      alert("Street, City, State and Pin Code are required.");
      return;
    }
    onAdd(form);
    setForm({ street: "", city: "", state: "", pinCode: "", isPrimary: false });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
      <input name="street" placeholder="Street" value={form.street} onChange={handleChange} />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
      <input name="pinCode" placeholder="Pin Code" value={form.pinCode} onChange={handleChange} />
      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input type="checkbox" name="isPrimary" checked={form.isPrimary} onChange={handleChange} />
        Primary address
      </label>
      <button type="submit">Add Address</button>
    </form>
  );
}
