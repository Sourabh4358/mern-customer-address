import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // axios instance (make sure it's baseURL: http://localhost:5000)

const emptyAddress = () => ({
  street: "",
  city: "",
  state: "",
  pinCode: "",
  isPrimary: false,
  _key: crypto.randomUUID ? crypto.randomUUID() : String(Math.random()),
});

export default function CustomerCreatePage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [addresses, setAddresses] = useState([emptyAddress()]);
  const [saving, setSaving] = useState(false);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (key, e) => {
    const { name, value, type, checked } = e.target;
    setAddresses((prev) =>
      prev.map((a) =>
        a._key === key ? { ...a, [name]: type === "checkbox" ? checked : value } : a
      )
    );
  };

  const addAddressRow = () => setAddresses((prev) => [...prev, emptyAddress()]);
  const removeAddressRow = (key) =>
    setAddresses((prev) => (prev.length > 1 ? prev.filter((a) => a._key !== key) : prev));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate customer
    if (!customer.firstName.trim() || !customer.email.trim()) {
      alert("First Name and Email are required.");
      return;
    }
    // Validate addresses
    for (const a of addresses) {
      if (!a.street.trim() || !a.city.trim() || !a.state.trim() || !a.pinCode.trim()) {
        alert("Every address needs Street, City, State and Pin Code.");
        return;
      }
    }

    try {
      setSaving(true);

      // 1) Create customer
      const custRes = await api.post("/customers", {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
      });

      const customerId = custRes.data?._id || custRes.data?.id;
      if (!customerId) {
        throw new Error("Could not read created customer id from response.");
      }

      // 2) Create addresses linked to this customer
      for (const a of addresses) {
        await api.post(`/customers/${customerId}/address`, {
          street: a.street.trim(),
          city: a.city.trim(),
          state: a.state.trim(),
          pinCode: a.pinCode.trim(),
          isPrimary: !!a.isPrimary,
        });
      }

      alert("Customer and addresses saved!");
      navigate(`/customers/${customerId}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors) &&
          err.response.data.errors.map((e) => e.msg).join(", ")) ||
        "Failed to save. Check console.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Create Customer & Addresses</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 640 }}>
        {/* Customer */}
        <fieldset style={{ border: "1px solid #ddd", padding: 12 }}>
          <legend>Customer</legend>
          <div style={{ display: "grid", gap: 8 }}>
            <input
              name="firstName"
              placeholder="First Name"
              value={customer.firstName}
              onChange={handleCustomerChange}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={customer.lastName}
              onChange={handleCustomerChange}
            />
            <input
              name="email"
              placeholder="Email"
              value={customer.email}
              onChange={handleCustomerChange}
            />
            <input
              name="phone"
              placeholder="Phone"
              value={customer.phone}
              onChange={handleCustomerChange}
            />
          </div>
        </fieldset>

        {/* Addresses */}
        <fieldset style={{ border: "1px solid #ddd", padding: 12 }}>
          <legend>Addresses</legend>

          {addresses.map((a) => (
            <div
              key={a._key}
              style={{ border: "1px solid #eee", padding: 10, marginBottom: 10 }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <input
                  name="street"
                  placeholder="Street"
                  value={a.street}
                  onChange={(e) => handleAddressChange(a._key, e)}
                />
                <input
                  name="city"
                  placeholder="City"
                  value={a.city}
                  onChange={(e) => handleAddressChange(a._key, e)}
                />
                <input
                  name="state"
                  placeholder="State"
                  value={a.state}
                  onChange={(e) => handleAddressChange(a._key, e)}
                />
                <input
                  name="pinCode"
                  placeholder="Pin Code"
                  value={a.pinCode}
                  onChange={(e) => handleAddressChange(a._key, e)}
                />
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="checkbox"
                    name="isPrimary"
                    checked={a.isPrimary}
                    onChange={(e) => handleAddressChange(a._key, e)}
                  />
                  Primary
                </label>
              </div>
              <div style={{ marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => removeAddressRow(a._key)}
                  disabled={addresses.length === 1}
                >
                  Remove address
                </button>
              </div>
            </div>
          ))}

          <button type="button" onClick={addAddressRow}>
            + Add another address
          </button>
        </fieldset>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Customer & Addresses"}
        </button>
      </form>
    </div>
  );
}
