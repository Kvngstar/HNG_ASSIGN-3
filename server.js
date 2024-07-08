const dotenv = require("dotenv");
dotenv.config();
const app = require("./index");
const { dB } = require("./src/database/authDatabase");


const PORT = process.env.PORT || 3009;
dB.auth();

app.listen(PORT, () => {
	console.log(`App is running 🚀 on ${PORT}.`);
});
