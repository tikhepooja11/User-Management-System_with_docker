const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
class UserRepository {
  constructor() {
    this.model = new UserModel();
  }
  register = async (user) => {
    const { name, email, password, phone, address, location } = user;
    console.log(name);
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: encryptedPassword,
      phone,
      address,
      location,
    });

    // Create Token
    const token = jwt.sign({ id: newUser._id, email }, config.token.TOKEN_KEY);
    newUser.token = token;
    const savedUser = await newUser.save();
    console.log("inside repository", savedUser);
    return savedUser;
  };
  findUser = async (email) => {
    const result = await UserModel.findOne({ email });
    return result;
  };
  userList = async () => {
    const result = await UserModel.find();
    return result;
  };
  getUserDetails = async (id) => {
    const result = await UserModel.find({ _id: id });
    return result;
  };
  getUserLocation = async (id) => {
    const user = await UserModel.findOne({ _id: id });
    const locationCordinates = {
      latitude: user.location.coordinates[0],
      longitude: user.location.coordinates[1],
    };
    return locationCordinates;
  };
  getNearByUsers = async (location) => {
    const latitude = location.coordinates[0];
    const longitude = location.coordinates[1];
    const nearbyUsersList = await UserModel.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [latitude, longitude] },
        },
      },
    });
    console.log("inside repo nearbyUsersList", nearbyUsersList);
    return nearbyUsersList;
  };
  deleteUser = async (id) => {
    const result = await UserModel.findByIdAndDelete(id);
    return result;
  };
  updateUser = async (id, updateInput) => {
    const options = { new: true };
    const result = await UserModel.findByIdAndUpdate(id, updateInput, options);
    return result;
  };
}
module.exports = UserRepository;
