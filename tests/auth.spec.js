const dotenv = require("dotenv");
dotenv.config();
const request = require("supertest");
const {
	User,
	Organisation,
	UserOrganisation,
	sequelize,
} = require("../src/database/models/index");
const jwt = require("jsonwebtoken");
const app = require("../index");


describe("Generate Token", () => {
	it("should generate a token with correct user details and expiry time", async () => {
		const user = {
			id: 1,
			firstName: "Kingsely",
			lastName: "Okoronkwo",
			email: "kvngsley019@gmail.com",
		};
		const token = jwt.sign(user, process.env.JWT_KEY, { expiresIn: "1h" });
		const decoded = jwt.verify(token, process.env.JWT_KEY);

		expect(decoded.id).toBe(user.id);
		expect(decoded.firstName).toBe(user.firstName);
		expect(decoded.lastName).toBe(user.lastName);
		expect(decoded.email).toBe(user.email);
		expect(decoded.exp).toBeDefined();
	});
});

describe("Organisation Access Control", () => {
	let token, org1, org2, user1, user2;

	beforeAll(async () => {
		// Create test users

		user1 = await User.create({
			firstName: "kings",
			lastName: "kings",
			email: "kings@gmail.com",
			password: "12345678",
		});
		user2 = await User.create({
			firstName: "Jane",
			lastName: "Smith",
			email: "jane.smith@example.com",
			password: "12345678",
		});

		// Create test organisations
		org1 = await Organisation.create({
			name: "kings's Organisation",
			description: "Organisation for John",
		});
		org2 = await Organisation.create({
			name: "Jane's Organisation",
			description: "Organisation for Jane",
		});

		await UserOrganisation.create({
			userId: user1.id,
			organisationId: org1.id,
		});
		await UserOrganisation.create({
			userId: user2.id,
			organisationId: org2.id,
		});

		token = jwt.sign(
			{ id: user1.id, firstName: user1.firstName, email: user1.email },
			process.env.JWT_KEY,
			{ expiresIn: "1h" }
		);
	});

	it("should allow user to access their own organisation", async () => {
		const res = await request(app)
			.get(`/api/organisations/${org1.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.data.orgId).toBe(org1.id);
		expect(res.body.data.name).toBe("John's Organisation");
	});

	it("should not allow user to access other organisations", async () => {
		const res = await request(app)
			.get(`/api/organisations/${org2.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(403);
		expect(res.body.message).toBe(
			"Access forbidden: You do not have access to this organisation"
		);
	});

	afterAll(async () => {
		// Clean up database
		await UserOrganisation.destroy({ where: {} });
		await Organisation.destroy({ where: {} });
		await User.destroy({ where: {} });
	});
});

// Register User Successfully with Default Organisation
describe("User Registration and Authentication", () => {
	beforeAll(async () => {
		await sequelize.sync({ force: true });
	});

	it("should register user successfully with default organisation", async () => {
		const res = await request(app).post("/auth/register").send({
			firstName: "king",
			lastName: "okoronkwo",
			email: "king.okoronkwo@example.com",
			password: "password",
			phone: "1234567890",
		});

		expect(res.status).toBe(201);
		expect(res.body.status).toBe("success");
		expect(res.body.data.user.firstName).toBe("king");
		expect(res.body.data.user.lastName).toBe("okoronkwo");
		expect(res.body.data.organisation.name).toBe("king's Organisation");

		// Check if token is present
		expect(res.body.data.token).toBeTruthy();
	});

	// Login Successfully
	it("should log the user in successfully", async () => {
		// Ensure user exists
		await User.create({
			firstName: "king",
			lastName: "okoronkwo",
			email: "king.okoronkwo@example.com",
			password: "12345678",
		});

		const res = await request(app).post("/auth/login").send({
			email: "king.okoronkwo@example.com",
			password: "12345678",
		});

		expect(res.status).toBe(200);
		expect(res.body.status).toBe("success");
		expect(res.body.data.user.email).toBe("king.okoronkwo@example.com");

		// Check if token is present
		expect(res.body.data.token).toBeTruthy();
	});

	it("should fail if required fields are missing", async () => {
		const requiredFields = ["firstName", "lastName", "email", "password"];

		for (const field of requiredFields) {
			const userData = {
				firstName: "king",
				lastName: "okoronkwo",
				email: "king.okoronkwo@example.com",
				password: "11111111",
				phone: "1234567890",
			};
			delete userData[field];

			const res = await request(app).post("/auth/register").send(userData);

			expect(res.status).toBe(422);
			expect(res.body.status).toBe("error");
			expect(res.body.message).toContain(`${field} is required`);
		}
	});
});
