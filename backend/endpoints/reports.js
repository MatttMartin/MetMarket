const express = require('express');
const router = express.Router();
const pool = require("../db");

// Get reported ads
router.get("/reported-ads", async (req, res) => {
  try {
    const sqlQuery =
      "SELECT ads.*, reported_ads.reason FROM ads INNER JOIN reported_ads ON ads.id = reported_ads.ad_id";
    const result = await pool.query(sqlQuery);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Get reported users
router.get("/reported-users", async (req, res) => {
  try {
    const sqlQuery =
      "SELECT users.*, reported_users.reason FROM users INNER JOIN reported_users ON users.id = reported_users.reported_user_id";
    const result = await pool.query(sqlQuery);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
