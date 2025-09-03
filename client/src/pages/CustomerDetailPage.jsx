import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import AddressForm from "../components/AddressForm";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/customers/${id}`);
      setCustomer(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load customer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const addAddress = async (address) => {
    try {
      await api.post(`/customers/${id}/address`, address);
      await fetchCustomer(); // refresh list
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg =
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors) && err.response.data.errors.map(e => e.msg).join(", ")) ||
        "Failed to add address.";
      alert(msg);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>Not found.</p>;

return (
  <div className="max-w-2xl mx-auto my-6 px-4">
    {/* Back Link */}
    <p className="mb-4">
      <Link
        to="/"
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        ← Back
      </Link>
    </p>

    {/* Customer Info */}
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800">
        {customer.firstName} {customer.lastName}
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        {customer.email} {customer.phone ? `• ${customer.phone}` : ""}
      </p>
    </div>

    {/* Addresses */}
    <div className="bg-white border border-gray-200 rounded-lg mt-6">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-800">Addresses</h3>
      </div>
      {Array.isArray(customer.addresses) && customer.addresses.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {customer.addresses.map((a) => (
            <li key={a._id} className="px-4 py-3 text-sm text-gray-700">
              {a.street}, {a.city}, {a.state} {a.pinCode}{" "}
              {a.isPrimary && (
                <span className="ml-1 text-green-600 font-medium">
                  — Primary
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-3 text-sm text-gray-500 italic">
          No addresses.
        </p>
      )}
    </div>

    {/* Add New Address */}
    <div className="bg-white border border-gray-200 rounded-lg mt-6">
      <div className="px-4 py-3 border-b border-gray-200">
        <h4 className="text-base font-medium text-gray-800">
          Add another address
        </h4>
      </div>
      <div className="px-4 py-3">
        <AddressForm onAdd={addAddress} />
      </div>
    </div>
  </div>
);



}
