require("dotenv").config({ path: ".env" });
// This file was not used, sicee i had issue using render pso
module.exports = {
	production: {
		connection_url: process.env.DB_CONN_URL
	},
	development: {
		connection_url: process.env.DB_CONN_URL,
		
	},
};
