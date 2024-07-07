const dotenv = require("dotenv");
const app = require("./index");
const { dB } = require("./src/database/authDatabase");

dotenv.config();

const PORT = process.env.PORT || 3009;
dB.auth();

app.listen(PORT, () => {
	console.log(`App is running 🚀 on ${PORT}.`);
});
