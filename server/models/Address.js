const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
});

module.exports = mongoose.model("Address", addressSchema);
