const { sequelize } = require("./models");

class AuthDataBase {
	auth = async () => {
		try {
			await sequelize.authenticate();
			console.log("Database Authentication Successful.");
		} catch (error) {
			console.error("Unable to connect to the database: ", error);
		}
	};

	module = require("sequelize");
}

exports.dB = new AuthDataBase();
