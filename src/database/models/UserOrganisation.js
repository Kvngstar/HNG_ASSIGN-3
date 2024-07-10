"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class UserOrganisation extends Model {
		static associate(models) {
			// Define associations here if needed
		}
	}

	UserOrganisation.init(
		{
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
				references: {
					model: "User",
					key: "userId",
				},
			},
			orgId: {
				type: DataTypes.STRING,
				allowNull: false,
				references: {
					model: "Organisation",
					key: "orgId",
				},
			},
		},
		{
			sequelize,
			modelName: "UserOrganisation",
			tableName: "UserOrganisation",
			timestamps: true,
			paranoid: true,
		}
	);

	return UserOrganisation;
};
