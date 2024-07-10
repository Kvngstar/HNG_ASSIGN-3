const jwt = require("jsonwebtoken");
// Change this to your secret key

const authenticator = (req, res, next) => {
	console.log("Running Middleware..");
	console.log(req.header("Authorization"), "header");
	const token = req.header("Authorization").split(" ")[1];
	if (!token) return res.status(401).json({ message: "Access denied" });

	jwt.verify(token, process.env.JWT_KEY, (err, user) => {
		if (err) return res.status(403).json({ message: "Invalid token" });

		console.log(user);
		req.user = user;
		next();
	});
};

module.exports = authenticator;
