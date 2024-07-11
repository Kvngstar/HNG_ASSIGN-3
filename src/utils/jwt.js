const jwt = require("jsonwebtoken");

const _ = require("lodash");
exports.createToken = (data) => {
	const extractData = _.pick(data, ["userId", "email"]);
	return jwt.sign(extractData, process.env.JWT_KEY);
};
