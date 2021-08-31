const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'comments',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      message: {
        type: DataTypes.STRING(1500),
        allowNull: true,
      },
      posts_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
      },
      pseudonyms: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      users_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        // references: {
        //   model: 'users',
        //   key: 'id'
        // }
      },
      isAuthor: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'comments',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'fk_comments_posts1_idx',
          using: 'BTREE',
          fields: [{ name: 'posts_id' }],
        },
        // {
        //   name: "fk_comments_users1_idx",
        //   using: "BTREE",
        //   fields: [
        //     { name: "users_id" },
        //   ]
        // },
      ],
    }
  );
};
