const express = require("express");
const app = express();

// app.use((req, res, next) => {
//   console.log("Hello World👋🏾");
//   next();
// });
// app.use((req, res, next) => {
//   res.send("<h1>Happing Coding😊💻</h1>");
// });

app.use("/users", (req, res, next) => {
  res.send("<h1>Happing Coding😊💻</h1>");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Hello to the coding word!!</h1>");
});

app.listen(3000);
