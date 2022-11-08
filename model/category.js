const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/config");
const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING({ length: 64 }),
    },
    slug: {
      type: DataTypes.STRING({ length: 100 }),
    },
  },
  {}
);
module.exports = Category;
