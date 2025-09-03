const express = require("express");
const Customer = require("../models/Customer");
const Address = require("../models/Address");

const router = express.Router();

// Create customer
router.post("/", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get customer with addresses
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("addresses");
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const result = await Customer.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Optionally, delete related addresses
    const Address = require("../models/Address");
    await Address.deleteMany({ customerId: req.params.id });

    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// Add address for a customer
router.post("/:id/address", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const address = new Address({ ...req.body, customerId: req.params.id });

    // Ensure only one primary address
    if (req.body.isPrimary) {
      await Address.updateMany({ customerId: req.params.id }, { isPrimary: false });
    }

    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all customers with addresses
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().populate("addresses");
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
