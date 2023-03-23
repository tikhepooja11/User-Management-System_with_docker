const express = require("express");
const router = express.Router();
router.get("/createAddress", async (req, res, next) => {});
router.get("/getAddress:id", async (req, res, next) => {});
router.patch("/updateAddress:id", async (req, res, next) => {});
router.delete("/deleteAddress:id", async (req, res, next) => {});
module.exports = router;
