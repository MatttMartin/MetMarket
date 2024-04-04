const express = require("express");
const router = express.Router();
const pool = require("../db");
const bodyParser = require("body-parser");
const jwtMiddleware = require('../jwtMiddleware')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/messages", jwtMiddleware, async (req, res) => {
	console.log("in messages")
	try {
		const signedInUserID = req.query.signedInUserID;

		const result = await pool.query(
			`SELECT
            m.*,
            sender.first_name AS sender_first_name,
            sender.last_name AS sender_last_name,
            receiver.first_name AS receiver_first_name,
            receiver.last_name AS receiver_last_name
        FROM
            Messages m
        INNER JOIN
            Users sender ON m.Sender_id = sender.id
        INNER JOIN
            Users receiver ON m.Receiver_id = receiver.id
        WHERE
            m.Sender_id = $1 OR m.Receiver_id = $1;`,
			[signedInUserID]
		);
		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

router.get("/conversations", jwtMiddleware, async (req, res) => {
	try {
		const signedInUserID = req.query.signedInUserID;

		const result = await pool.query(
			`SELECT
      c.*,
      user1.first_name AS user1_first_name,
      user1.last_name AS user1_last_name,
      user2.first_name AS user2_first_name,
      user2.last_name AS user2_last_name,
			p.title AS product_title
  FROM
      Conversations c
  INNER JOIN
      Users user1 ON c.Userid1 = user1.id
  INNER JOIN
      Users user2 ON c.Userid2 = user2.id
	INNER JOIN
			Products p ON c.product_id = p.product_id
  WHERE
      c.Userid1 = $1 OR c.Userid2 = $1;`,
			[signedInUserID]
		);
		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

router.post("/conversations", jwtMiddleware, async (req, res) => {
	try {
		const { product_id, userid } = req.body;

		// Fetch product information to ensure it exists
		const productQuery = await pool.query(
			"SELECT user_id FROM Products WHERE product_id = $1",
			[product_id]
		);

		if (productQuery.rows.length === 0) {
			return res.status(404).json({ error: "Product not found" });
		}

		const { user_id } = productQuery.rows[0];

		// Create a new conversation entry
		const insertQuery = await pool.query(
			"INSERT INTO Conversations (userid1, userid2, product_id) VALUES ($1, $2, $3) RETURNING conversation_id", // Just return the ID
			[user_id, userid, product_id]
		);

		const conversationId = insertQuery.rows[0].conversation_id;

		// Fetch the newly created conversation with additional details
		const result = await pool.query(
			`SELECT
			  c.*,
			  user1.first_name AS user1_first_name,
			  user1.last_name AS user1_last_name,
			  user2.first_name AS user2_first_name,
			  user2.last_name AS user2_last_name,
			  p.title AS product_title
			FROM
			  Conversations c
			INNER JOIN
			  Users user1 ON c.Userid1 = user1.id
			INNER JOIN
			  Users user2 ON c.Userid2 = user2.id
			INNER JOIN
			  Products p ON c.product_id = p.product_id
			WHERE
			  c.conversation_id = $1;`,
			[conversationId]
		);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating conversation:", error);
		res.status(500).json({ error: "Server error" });
	}
});


router.post("/messages", jwtMiddleware, async (req, res) => {
	try {
		const result = await pool.query(
			`INSERT INTO messages (sender_id, receiver_id, message, time_stamp, conversation_id)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4);`,
			[req.body.senderID, req.body.recieverID, req.body.message, req.body.conversation_id]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
