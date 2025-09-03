import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, User, Mail, Phone, MapPin } from "lucide-react";
import api from "../api";
import './CustomerForm.css'

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

    if (!customer.firstName.trim() || !customer.email.trim()) {
      alert("First Name and Email are required.");
      return;
    }

    for (const a of addresses) {
      if (!a.street.trim() || !a.city.trim() || !a.state.trim() || !a.pinCode.trim()) {
        alert("Every address needs Street, City, State and Pin Code.");
        return;
      }
    }

    try {
      setSaving(true);

      const custRes = await api.post("/customers", {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
      });

      const customerId = custRes.data?._id || custRes.data?.id;
      if (!customerId) throw new Error("Could not read created customer id from response.");

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
  <div className="max-w-xl mx-auto my-6 p-3">
    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center">
      Create Customer & Addresses
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer Section */}
      <fieldset className="border border-gray-300 rounded p-3">
        <legend className="text-sm font-medium text-gray-700 px-1">
          Customer
        </legend>
        <div className="space-y-2 mt-2">
          <input
            name="firstName"
            placeholder="First Name"
            value={customer.firstName}
            onChange={handleCustomerChange}
            className="w-full p-1.5 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={customer.lastName}
            onChange={handleCustomerChange}
            className="w-full p-1.5 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={customer.email}
            onChange={handleCustomerChange}
            className="w-full p-1.5 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            value={customer.phone}
            onChange={handleCustomerChange}
            className="w-full p-1.5 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
      </fieldset>

      {/* Addresses Section */}
      <fieldset className="border border-gray-300 rounded p-3">
        <legend className="text-sm font-medium text-gray-700 px-1">
          Addresses
        </legend>

        {addresses.map((a) => (
          <div
            key={a._key}
            className="border border-gray-200 rounded p-2 mt-2 space-y-2"
          >
            <input
              name="street"
              placeholder="Street"
              value={a.street}
              onChange={(e) => handleAddressChange(a._key, e)}
              className="w-full p-1.5 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <input
              name="city"
              placeholder="City"
              value={a.city}
              onChange={(e) => handleAddressChange(a._key, e)}
              className="w-full p-1.5 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <input
              name="state"
              placeholder="State"
              value={a.state}
              onChange={(e) => handleAddressChange(a._key, e)}
              className="w-full p-1.5 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <input
              name="pinCode"
              type="number"
              placeholder="Pin Code"
              value={a.pinCode}
              onChange={(e) => handleAddressChange(a._key, e)}
              className="w-full p-1.5 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
            />

            <label className="flex items-center gap-2 text-gray-700 text-xs">
              <input
                type="checkbox"
                name="isPrimary"
                checked={a.isPrimary}
                onChange={(e) => handleAddressChange(a._key, e)}
                className="h-3 w-3 text-blue-600 border-gray-300 rounded"
              />
              Primary
            </label>

            <button
              type="button"
              onClick={() => removeAddressRow(a._key)}
              disabled={addresses.length === 1}
              className="text-red-600 text-xs underline disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addAddressRow}
          className="mt-3 px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
        >
          + Add Address
        </button>
      </fieldset>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  </div>
);


}
