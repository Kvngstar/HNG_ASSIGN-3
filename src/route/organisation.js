const express = require("express");
const OrgRouter = express.Router();

const {
	User,
	Organisation,
	UserOrganisation,
} = require("../database/models/index.js");
const authenticator = require("../middleware/isAuth.js");

OrgRouter.get("/", authenticator, async (req, res) => {
	try {
		const userId = req.user.userId;
		console.log(userId, "userId");
		const organisations = await Organisation.findAll({
			include: [
				{
					model: User,
					as: "users",
					where: { userId },
					attributes: [],
					through: { attributes: [] },
				},
			],
		});

		res.status(200).json({
			status: "success",
			message: "Organisations retrieved successfully",
			data: {
				organisations: organisations.map((org) => ({
					orgId: org.orgId,
					name: org.name,
					description: org.description,
				})),
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: "error",
			message: "Failed to retrieve organisations",
		});
	}
});
OrgRouter.get("/:orgId", authenticator, async (req, res) => {
	const { orgId } = req.params;
	console.log(orgId, "orgId");
	console.log(req.user.userId, "orgId");
	try {
		const { dataValues } = await Organisation.findOne({
			where: { orgId },
			include: [
				{
					model: User,
					as: "users",
					through: { attributes: [] },
					where: { userId: req.user.userId },
				},
			],
		});

		if (!dataValues) {
			return res.status(404).json({ error: "Organisation not found" });
		}

		res.status(200).json({
			status: "success",
			message: "Organisations retrieved successfully",
			data: {
				organisations: {
					orgId: dataValues.orgId,
					name: dataValues.name,
					description: dataValues.description || "New Organisation",
				},
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
OrgRouter.post("/", authenticator, async (req, res) => {
	const { name, description } = req.body;

	if (!name) {
		return res.status(400).json({
			status: "Bad Request",
			message: "Client error",
			statusCode: 400,
		});
	}

	try {
		const newOrg = await Organisation.create({
			name,
			description,
		});

		await UserOrganisation.create({
			userId: req.user.userId,
			orgId: newOrg.orgId,
		});

		res.status(201).json({
			status: "success",
			message: "Organisation created successfully",
			data: {
				orgId: newOrg.orgId,
				name: newOrg.name,
				description: newOrg.description,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
});

OrgRouter.post(
	"/:orgId/users",
	authenticator,
	async (req, res) => {
		const { orgId } = req.params;
		const { userId } = req.body;

		if (!userId) {
			return res.status(400).json({
				status: "Bad Request",
				message: "Client error",
				statusCode: 400,
			});
		}

		try {
			const organisation = await Organisation.findByPk(orgId);

			if (!organisation) {
				return res.status(404).json({
					status: "error",
					message: "Organisation not found",
				});
			}

			await UserOrganisation.create({
				userId,
				orgId: orgId,
			});

			res.status(200).json({
				status: "success",
				message: "User added to organisation successfully",
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	}
);

module.exports = OrgRouter;
