"use strict";
const { Model } = require("sequelize");
const user = require("./user");
module.exports = (sequelize, DataTypes) => {
	class Organisation extends Model {
		static associate(models) {
			Organisation.belongsToMany(models.User, {
				through: "UserOrganisation",
				as: "users",
				foreignKey: "orgId",
			});
		}

		toJSON() {
			return {
				...this.get(),
				// id: undefined,
				// clearTime: undefined,
				updatedAt: undefined,
			};
		}
	}

	Organisation.init(
		{
			orgId: {
				type: DataTypes.STRING,
				defaultValue: DataTypes.UUIDV4,
				unique: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Name required" },
				},
			},
			description: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: "Organisation",
			tableName: "organisation",
			paranoid: true,
		}
	);

	return Organisation;
};
