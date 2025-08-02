const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "ass3public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "users.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
