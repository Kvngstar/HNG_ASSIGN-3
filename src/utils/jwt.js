const jwt = require("jsonwebtoken");

const _ = require("lodash");
exports.createToken = (req) => {
	console.log(process.env.JWT_KEY, "process.env.JWT_KEY");
	const extractData = _.pick(req.body, ["userId", "email"]);
	return jwt.sign(extractData, process.env.JWT_KEY);
};
