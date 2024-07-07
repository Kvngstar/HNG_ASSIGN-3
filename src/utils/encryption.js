const bcrypt = require("bcrypt");

exports.generateHashedPassword = (password) => {
	// Promise to handle salt generation for hashing password
	return new Promise((resolve, reject) => {
		// Generate salt
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				reject(err);
				return;
			}

			// Hashing point
			bcrypt.hash(password, salt, (err, hashedPassword) => {
				if (err) {
					reject(err);
					return;
				}

				// Return hashed password
				resolve(hashedPassword);
			});
		});
	});
};
