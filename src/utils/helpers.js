const _ = require("lodash");

exports.extractPassword = (userObject) => {
	return _.omit(userObject, ["password"]);
};
