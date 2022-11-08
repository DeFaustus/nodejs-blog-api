const { Sequelize, DataTypes } = require("sequelize");
const { Post, Category } = require(".");
const sequelize = require("../database/config");
const CategoryPost = sequelize.define(
  "category_post",
  {
    PostId: {
      type: DataTypes.INTEGER,
      references: {
        model: Post,
        key: "id",
      },
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
module.exports = CategoryPost;
