const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
});

module.exports = mongoose.model("AddressModel", addressSchema);
