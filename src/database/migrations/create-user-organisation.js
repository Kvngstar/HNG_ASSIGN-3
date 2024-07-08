"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("UserOrganisation", {
			userId: {
				type: Sequelize.UUID,
				references: {
					model: "user",
					key: "userId",
				},
				allowNull: false,
			},
			organisationId: {
				type: Sequelize.UUID,
				references: {
					model: "organisation",
					key: "orgId",
				},
				allowNull: false,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			deletedAt: {
				type: Sequelize.DATE,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("UserOrganisation");
	},
};
