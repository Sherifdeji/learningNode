const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-course", "root", "Sherif", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
