const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const pool = require("../db");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/locations", async (req, res) => {
  try {
 
    const query = 'SELECT * FROM locations';
    const result = await pool.query(query);
    
    res.status(201).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


router.get("/getProvinces", async (req, res) => {
  try {
 
    const query = 'SELECT * FROM provinces';
    const result = await pool.query(query);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


router.get("/getCities", async (req, res) => {
  try {
    const province_id = req.query.province_id;

    const query = `SELECT * FROM locations WHERE province_id = ${province_id}`;
    const result = await pool.query(query);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
