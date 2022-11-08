const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("api", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
