const mongoose = require("mongoose");
const Address = require("./address");
console.log(typeof Address);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String, //{ type: Schema.Types.ObjectId, ref: "Address", require: true },
  token: String,
  location: {
    type: Object,
    index: "2dsphere",
    cordinates: {
      type: [
        {
          latitude: Number,
          longitude: Number,
        },
      ],
    },
  },
});
// userSchema.index({ location: "2dsphere", unique: true });

module.exports = mongoose.model("UserModel", userSchema);
