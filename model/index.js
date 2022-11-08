const model = {};
model.User = require("./user");
model.Post = require("./post");
model.Category = require("./category");
model.CategoryPost = require("./category_post");
//relasi one to many user ke post
model.User.hasMany(model.Post, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
model.Post.belongsTo(model.User);
//end one to many
//relasi many to many post ke kategori
model.Post.belongsToMany(model.Category, {
  through: model.CategoryPost,
});
model.Category.belongsToMany(model.Post, {
  through: model.CategoryPost,
});
//end many to many
module.exports = model;
