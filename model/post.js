const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/config");
const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    judul: {
      type: DataTypes.STRING({ length: 64 }),
    },
    excerpt: {
      type: DataTypes.STRING(),
    },
    slug: {
      type: DataTypes.STRING({ length: 100 }),
    },
    body: {
      type: DataTypes.TEXT,
    },
    gambar: {
      type: DataTypes.TEXT,
    },
  },
  {}
);
module.exports = Post;
