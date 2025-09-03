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
    <div>
      <p><Link to="/">{`← Back`}</Link></p>
      <h2>
        {customer.firstName} {customer.lastName}
      </h2>
      <div>{customer.email} {customer.phone ? `• ${customer.phone}` : ""}</div>

      <h3 style={{ marginTop: 16 }}>Addresses</h3>
      {Array.isArray(customer.addresses) && customer.addresses.length > 0 ? (
        <ul>
          {customer.addresses.map((a) => (
            <li key={a._id}>
              {a.street}, {a.city}, {a.state} {a.pinCode} {a.isPrimary ? "— Primary" : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>No addresses.</p>
      )}

      <h4 style={{ marginTop: 20 }}>Add another address</h4>
      <AddressForm onAdd={addAddress} />
    </div>
  );
}
