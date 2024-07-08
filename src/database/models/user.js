"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.belongsToMany(models.Organisation, {
				through: "UserOrganisation",
				as: "organisations",
				foreignKey: "userId",
			});
		}
	}

	User.init(
		{
			userId: {
				type: DataTypes.STRING,
				defaultValue: DataTypes.UUIDV4,
				unique: true,
        primaryKey: true,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "First name required" },
					notEmpty: { msg: "First name cannot be empty" },
				},
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Last name required" },
					notEmpty: { msg: "Last name cannot be empty" },
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notEmpty: { msg: "Email cannot be empty" },
					notNull: { msg: "Email required" },
					isEmail: { msg: "Invalid email address" },
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Password required" },
					notEmpty: { msg: "Password cannot be empty" },
				},
			},
			phone: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: "User",
			tableName: "user",
			paranoid: true,
		}
	);

	return User;
};
