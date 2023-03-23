const express = require("express");
const router = express.Router();
const UserService = require("../services/user");
const UserModel = require("../models/user");

const config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

router.post("/register", async (req, res, next) => {
  console.log("Registering new user");
  const userService = new UserService();
  try {
    const { name, email, password, phone, address, location } = req.body;

    // Validate User
    if (!(name && email && password)) {
      res.status(400).json({ message: "All input is required" });
    }
    const oldUser = await userService.findUser(email);
    if (oldUser) {
      return res
        .status(409)
        .json({ message: "User Already Exist. Please Login" });
    }
    const user = {
      name,
      email,
      password,
      phone,
      address,
      location,
    };
    const newUser = await userService.register(user);
    return res.json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const userService = new UserService();
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).json({ message: "Email and Password required" });
    }
    const oldUser = await userService.findUser(email);
    if (!oldUser) {
      return res.status(401).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, oldUser.password);
    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: oldUser._id, email }, config.token.TOKEN_KEY);
    oldUser.token = token;
    return res.status(200).json(oldUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(err);
  }
});
router.get("/userList", async (req, res, next) => {
  const userService = new UserService();
  try {
    const userList = await userService.userList();
    if (userList && userList.length > 0) {
      res.status(200).json(userList);
    } else {
      return res.status(404).json({ message: "Users not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/userdetails/:id", auth, async (req, res, next) => {
  console.log("inside route");
  const id = req.params.id;
  const userService = new UserService();
  try {
    const user = await userService.getUserDetails(id);
    console.log("user", user);
    if (user.length == 0) {
      return res.status(404).json({ message: "User with id not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log("err2");
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/getUserLocation/:id", auth, async (req, res, next) => {
  console.log("inside route");
  const id = req.params.id;
  const userService = new UserService();
  try {
    const checkValidUser = await userService.getUserDetails(id);
    if (!checkValidUser) {
      return res.status(400).json({ message: "User with id not found" });
    }
    const locationCordinates = await userService.getUserLocation(id);
    console.log(locationCordinates);
    if (locationCordinates) {
      res.status(200).json(locationCordinates);
    } else {
      return res.status(404).json({ message: "Location cordinates are empty" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/getNearbyUsers/:id", auth, async (req, res, next) => {
  const id = req.params.id;
  // console.log("index", await UserModel.listIndexes());
  const userService = new UserService();
  try {
    const checkValidUser = await userService.getUserDetails(id);

    if (!checkValidUser) {
      return res.status(400).json({ message: "User with id not found" });
    }
    const { location } = checkValidUser;
    if (location === undefined) {
      return res.status(400).json({ message: "Location cordinates are empty" });
    }
    const nearbyUsersList = await userService.getNearByUsers(location);
    if (nearbyUsersList.length > 0) {
      const filteredUsers = nearbyUsersList.filter((item) => item._id != id);
      return res.status(200).json(filteredUsers);
    } else {
      return res.status(404).json({ message: "Near by users not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete/:id", auth, async (req, res) => {
  const id = req.params.id;
  const userService = new UserService();
  try {
    const checkUserExists = await userService.getUserDetails(id);
    if (!checkUserExists) {
      return res.status(400).json({ message: "User with id not found" });
    }
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "Error in updating the user details" });
    }
    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/updateUser/:id", auth, async (req, res) => {
  console.log("Updating User");
  const id = req.params.id;
  const updateInput = req.body;
  const userService = new UserService();
  try {
    const checkUserExists = await userService.getUserDetails(id);
    console.log(typeof checkUserExists);
    if (checkUserExists.length === 0) {
      return res.status(400).json({ message: "User with id not found" });
    }
    const updatedUser = await userService.updateUser(id, updateInput);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Error in updating the user details" });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
