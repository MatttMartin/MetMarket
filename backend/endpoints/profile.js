const express = require("express");
const router = express.Router();
const pool = require("../db");
const bodyParser = require("body-parser");
const jwtMiddleware = require("../jwtMiddleware");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");
var cloudinary = require("cloudinary").v2;


const jwt = require("jsonwebtoken");

router.get("/details", jwtMiddleware, async (req, res) => {
	try {
		const signedInUserID = req.query.signedInUserID;

		const result = await pool.query(
			`
      SELECT users.*, profile_pictures.link AS profile_picture_link 
      FROM users 
      LEFT JOIN profile_pictures ON users.id = profile_pictures.user_id 
      WHERE users.id = $1
    `,
			[signedInUserID]
		);
		console.log(signedInUserID);
		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

router.put("/update", async (req, res) => {
	const { id, first_name, last_name, email, phone_number, is_admin } = req.body;
	try {
		await pool.query("UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, is_admin = $5 WHERE id = $6", [
			first_name,
			last_name,
			email,
			phone_number,
			is_admin,
			id
		]);
		res.status(200).json({ message: "User details updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server Error" });
	}
});

router.put("/newPassword", async (req, res) => {
	const { id, currentPassword, newPassword } = req.body;
	try {
		const currentHashResult = await pool.query("SELECT * FROM passwords WHERE user_id = $1", [id]);
		const currentHash = currentHashResult.rows[0];

		//compare provided password with hashed password in database
		const match = await bcrypt.compare(currentPassword, currentHash.hashed_password);

		if (!match) {
			return res.status(401).json({ error: "Password is incorrect." });
		}

		const hashedNewPassword = await bcrypt.hash(newPassword, 10);
		await pool.query("UPDATE passwords SET hashed_password=$1 WHERE user_id = $2", [hashedNewPassword, id]);
		res.status(200).json({ message: "User details updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server Error" });
	}
});

//signup end point
router.post("/", async (req, res) => {
	const { firstName, lastName, email, phoneNumber, password } = req.body;

	//checking if user already exists
	try {
		const checkUserResult = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
		if (checkUserResult.rows.length > 0) {
			return res.status(409).json({ error: "A user with that email already exists." });
		}
	} catch (error) {
		console.error("Error checking user existence:", error);
		return res.status(500).json({ error: "Server Error" });
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		//egin a transaction to ensure both inserts are executed or none at all
		const client = await pool.connect();

		try {
			await client.query("BEGIN");
			const insertUserText =
				"INSERT INTO users (is_admin, first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING id";
			const insertUserValues = [0, firstName, lastName, email, phoneNumber];

			//insert the user and get the user id
			const userResult = await client.query(insertUserText, insertUserValues);
			const userId = userResult.rows[0].id;

			//insert default profile picture
			await client.query("INSERT INTO profile_pictures (user_id, link) VALUES ($1, $2)", [
				userId,
				"https://res.cloudinary.com/da3eyb92c/image/upload/v1712177733/nv4umfhvuye8zqs2rz51.jpg",
			]);

			//insert the hashed password with returned user id
			const insertPasswordText = "INSERT INTO passwords (user_id, hashed_password) VALUES ($1, $2)";
			const insertPasswordValues = [userId, hashedPassword];
			await client.query(insertPasswordText, insertPasswordValues);

			//commit the transaction
			await client.query("COMMIT");

			const token = jwt.sign({ id: userId }, "jwtsecret", {
				expiresIn: "24h",
			});

			res.json({ token: token });
		} catch (error) {
			await client.query("ROLLBACK"); //if an error occurs, rollback the transaction
			console.error("Transaction error:", error);
			res.status(500).json({ error: "Server Error" });
		} finally {
			client.release(); 
		}
	} catch (error) {
		console.error("Error hashing password:", error);
		res.status(500).json({ error: "Server Error" });
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		//check if user exists and get their hashed password etc
		const query = `
      SELECT users.id, users.email, passwords.hashed_password, users.is_admin 
      FROM users 
      JOIN passwords ON users.id = passwords.user_id 
      WHERE users.email = $1
    `;
		const userResult = await pool.query(query, [email]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ error: "User does not exist." });
		}

		const user = userResult.rows[0];

		//check if provided password matches
		const match = await bcrypt.compare(password, user.hashed_password);

		if (!match) {
			return res.status(401).json({ error: "Password does is incorrect." });
		}

		const id = user.id;
		const token = jwt.sign({ id: id }, "jwtsecret", {
			expiresIn: "24h",
		});

		res.json({ token: token });
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Server Error" });
	}
});

//update profile pictures endpoint
router.put("/profilepic", async (req, res) => {
	try {
		const fileStr = req.body.image;
		const uploadResponse = await cloudinary.uploader.upload(fileStr);
    await pool.query("UPDATE profile_pictures SET link = $2 WHERE user_id = $1", [
      req.body.id,
      uploadResponse.secure_url,
    ]);    
		res.status(201).json({ url: uploadResponse.secure_url });
	} catch (err) {
		console.error(err);
		res.status(500).json({ err: "Something went wrong" });
	}
});

module.exports = router;
