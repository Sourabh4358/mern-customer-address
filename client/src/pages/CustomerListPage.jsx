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
    <div>
      <h2>Customers</h2>
      {customers.length === 0 ? (
        <p>No customers yet. <Link to="/customers/new">Create one</Link>.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {customers.map((c) => (
            <li key={c._id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <strong>{c.firstName} {c.lastName}</strong>
                  <div>{c.email} {c.phone ? `• ${c.phone}` : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/customers/${c._id}`}>View</Link>
                  <button onClick={() => navigate(`/customers/${c._id}/edit`)}>Edit</button>
                  <button onClick={() => handleDelete(c._id)} style={{ color: "red" }}>Delete</button>
                </div>
              </div>
              {Array.isArray(c.addresses) && c.addresses.length > 0 && (
                <ul style={{ marginTop: 10 }}>
                  {c.addresses.map((a) => (
                    <li key={a._id}>
                      {a.street}, {a.city}, {a.state} {a.pinCode} {a.isPrimary ? "— Primary" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
