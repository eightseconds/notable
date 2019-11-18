const express = require("express");
const router = express.Router();
const doctors = require("../../models/Doctors");

// Gets all doctors
router.get("/", async (req, res) => {
  await res.json(doctors);
});


module.exports = router