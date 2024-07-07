const jwt = require("jsonwebtoken");

const _ = require("lodash");
exports.createToken = (req) => {
	return jwt.sign(_.pick(req.body, ["userId", "email"], process.env.JWT_KEY));
};
