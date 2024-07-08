"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("user", {
			userId: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				unique: true,
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notNull: { msg: "Email address required" },
					notEmpty: { msg: "Email can't be empty" },
					isEmail: { msg: "Invalid email address" },
				},
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Password required" },
					notEmpty: { msg: "Password can't be empty" },
				},
			},
			phone: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("user");
	},
};
