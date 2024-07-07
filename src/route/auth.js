const express = require("express");
const AuthRouter = express.Router();
const validator = require("validator");
const encryption = require("../utils/encryption");

const jwt = require("../utils/jwt");
const helpers = require("../utils/helpers");
const organisation = require("../database/models/organisation");
const User = require("../database/models/user");

AuthRouter.post("/register", async (req, res) => {
	try {
		const { userId, firstName, lastName, email, password, phone } = req.body;

		let errors = [];

		// userId must be a string and unique
		if (typeof userId !== "string") {
			errors.push({ msg: "userId must be a string" });
		} else {
			// const user = await User.findOne({ userId });
			// if (user) {
			// 	errors.push({ msg: "userId already in use" });
			// }
		}

		// firstName must be a string and not null
		if (typeof firstName !== "string" || validator.isEmpty(firstName)) {
			errors.push({ msg: "firstName must not be null and must be a string" });
		}

		// lastName must be a string and not null
		if (typeof lastName !== "string" || validator.isEmpty(lastName)) {
			errors.push({ msg: "lastName must not be null and must be a string" });
		}

		// email must be a string, unique, and not null
		if (
			typeof email !== "string" ||
			validator.isEmpty(email) ||
			!validator.isEmail(email)
		) {
			errors.push({
				msg: "email must be a valid email address and must not be null",
			});
		} else {
			// const user = await User.findOne({ email });
			// if (user) {
			// 	errors.push({ msg: "email already in use" });
			// }
		}

		// password must be a string and not null
		if (typeof password !== "string" || validator.isEmpty(password)) {
			errors.push({ msg: "password must not be null and must be a string" });
		}

		// phone must be a string
		if (typeof phone !== "string") {
			errors.push({ msg: "phone must be a string" });
		}

		if (errors.length > 0) {
			return res.status(400).json({ errors: errors });
		}
		const hashedPwd = encryption.generateHashedPassword(password);
    console.log(User,"mine")
		const userdata = await User.create({
			// firstName,
			// lastName,
			// email,
			// password: hashedPwd,
			// phone,
		});

		const org = await organisation.create({
			name: `${firstName}'s Organisation`,
		});

		// remove user password
		userdata = helpers.extractPassword(userdata);

		const accessToken = jwt.createToken(userdata);
		return res.status(201).json({
			status: "success",
			message: "Registration successful",
			data: {
				accessToken,
				user: userdata,
			},
		});
	} catch (error) {
		console.log("error: ", error);
		res.status(400).json({
			status: "Bad Request",
			message: "Registration unsuccessful",
			statusCode: 400,
		});
	}
});

AuthRouter.post("/login", async (req, res) => {
	const { email, password } = req.body;
	let errors = [];

	// Validate email
	if (
		typeof email !== "string" ||
		validator.isEmpty(email) ||
		!validator.isEmail(email)
	) {
		errors.push({ msg: "Valid email is required" });
	}

	// Validate password
	if (typeof password !== "string" || validator.isEmpty(password)) {
		errors.push({ msg: "Password is required" });
	}

	if (errors.length > 0) {
		return res.status(400).json({ errors });
	}

	try {
		// Find the user by email
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Compare passwords
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({
				status: "Bad request",
				message: "Authentication failed",
				statusCode: 401,
			});
		}
		user = helpers.extractPassword(user);

		const accessToken = jwt.createToken(user);

		// If login successful
		res.status(200).json({
			status: "success",
			message: "Login successful",
			data: {
				accessToken: accessToken,
				user: user,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(401).json({
			status: "Bad request",
			message: "Authentication failed",
			statusCode: 401,
		});
	}
});

module.exports = AuthRouter;