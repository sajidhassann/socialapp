const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'posts',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      mood: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      author_uid: {
        type: DataTypes.STRING(255),
        allowNull: false,
        // references: {
        //   model: 'users',
        //   key: 'id'
        // }
      },
    },
    {
      sequelize,
      tableName: 'posts',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        // {
        //   name: "fk_posts_users_idx",
        //   using: "BTREE",
        //   fields: [
        //     { name: "author_uid" },
        //   ]
        // },
      ],
    }
  );
};
