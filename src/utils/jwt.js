const jwt = require("jsonwebtoken");

const _ = require("lodash");
exports.createToken = (data) => {
	console.log(process.env.JWT_KEY, "process.env.JWT_KEY");
	const extractData = _.pick(data, ["userId", "email"]);
	return jwt.sign(extractData, process.env.JWT_KEY); 
};
