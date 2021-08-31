const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'ratings',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      rating: {
        type: DataTypes.INTEGER,
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
      posts_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'ratings',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        // {
        //   name: "fk_ratings_users1_idx",
        //   using: "BTREE",
        //   fields: [
        //     { name: "users_id" },
        //   ]
        // },
        {
          name: 'fk_ratings_posts1_idx',
          using: 'BTREE',
          fields: [{ name: 'posts_id' }],
        },
      ],
    }
  );
};
