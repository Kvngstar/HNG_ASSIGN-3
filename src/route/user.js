const express = require("express");
const userRoute = express.Router();
const {
	User,
	Organisation,
	UserOrganisation,
} = require("../database/models/index.js");
const authenticator = require("../middleware/isAuth.js");

userRoute.get("/:id", authenticator, async (req, res) => {
	const { id } = req.params;
	const userId = req.user.userId;

	try {
		// Fetch the user
		const user = await User.findOne({ where: { userId: id } });

		if (!user) {
			return res
				.status(404)
				.json({ status: "error", message: "User not found" });
		}

		// Check if the requesting user is the same as the userId
		if (user.userId === userId) {
			return res.status(200).json({
				status: "success",
				message: "User retrieved successfully",
				data: {
					userId: user.userId,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					phone: user.phone,
				},
			});
		}

		// Fetch organizations where the requesting user is a member
		const organizations = await UserOrganisation.findAll({ where: { userId } });
		const organizationIds = organizations.map((org) => org.orgId);

		// Check if the requested user is part of any organization the requesting user belongs to
		const isUserInOrganization = await UserOrganisation.findOne({
			where: {
				userId: id,
				orgId: organizationIds,
			},
		});

		if (!isUserInOrganization) {
			return res
				.status(403)
				.json({ status: "error", message: "Access denied" });
		}

		return res.status(200).json({
			status: "success",
			message: "User retrieved successfully",
			data: {
				userId: user.userId,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone,
			},
		});
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "error", message: "Failed to retrieve user" });
	}
});

module.exports = userRoute;
