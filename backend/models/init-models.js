var DataTypes = require("sequelize").DataTypes;
var _comments = require("./comments");
var _posts = require("./posts");
var _ratings = require("./ratings");
var _users = require("./users");

function initModels(sequelize) {
  var comments = _comments(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var ratings = _ratings(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  comments.belongsTo(posts, { as: "post", foreignKey: "posts_id"});
  posts.hasMany(comments, { as: "comments", foreignKey: "posts_id"});
  ratings.belongsTo(posts, { as: "post", foreignKey: "posts_id"});
  posts.hasMany(ratings, { as: "ratings", foreignKey: "posts_id"});
  comments.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(comments, { as: "comments", foreignKey: "users_id"});
  posts.belongsTo(users, { as: "author_u", foreignKey: "author_uid"});
  users.hasMany(posts, { as: "posts", foreignKey: "author_uid"});
  ratings.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(ratings, { as: "ratings", foreignKey: "users_id"});

  return {
    comments,
    posts,
    ratings,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
