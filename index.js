const express = require("express");
const cors = require("cors");
const AuthRouter = require("./src/route/auth");
const userRoute = require("./src/route/user");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json());

app.use("/auth",AuthRouter)
app.use("/api/users",userRoute)
  
app.get("/health", async (req, res) => {
  res.status(200).json("Server running 🚀")
});
 
module.exports = app;
