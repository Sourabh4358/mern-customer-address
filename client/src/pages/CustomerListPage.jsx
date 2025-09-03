import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers");
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await api.delete(`/customers/${id}`);
      alert("Customer deleted successfully.");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete customer.");
    }
  };

  if (loading) return <p>Loading...</p>;
return (
  <div className="max-w-3xl mx-auto my-6 px-3">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Customers</h2>

    {customers.length === 0 ? (
      <p className="text-gray-600 text-sm">
        No customers yet.{" "}
        <Link
          to="/customers/new"
          className="text-blue-600 hover:underline font-medium"
        >
          Create one
        </Link>.
      </p>
    ) : (
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {customers.map((c) => (
            <li
              key={c._id}
              className="px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              {/* Top Row: Name & Actions */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <p className="font-medium text-gray-800">{c.firstName} {c.lastName}</p>
                  <p className="text-sm text-gray-600">
                    {c.email} {c.phone ? `• ${c.phone}` : ""}
                  </p>
                </div>

                <div className="flex gap-3 text-sm font-medium mt-2 sm:mt-0">
                  <Link
                    to={`/customers/${c._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => navigate(`/customers/${c._id}/edit`)}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Addresses */}
              {Array.isArray(c.addresses) && c.addresses.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700 space-y-1">
                  {c.addresses.map((a) => (
                    <li key={a._id} className="pl-3 border-l border-gray-300">
                      {a.street}, {a.city}, {a.state} {a.pinCode}{" "}
                      {a.isPrimary && (
                        <span className="ml-1 text-green-600 font-medium">
                          — Primary
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);


}
