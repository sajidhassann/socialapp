const express = require('express');
const Router = express.Router();
const db = require('../models');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var saltRouds = 10;

const getTokenIdMiddleware = async (req, res, next) => {
  if (req.headers.authorization != null) {
    const usertoken = req.headers.authorization;
    console.log(usertoken);
    const token = usertoken.split(' ');
    console.log(token);
    console.log(token[1]);
    const decoded = jwt.verify(token[1], 'abcdefghijklmnopqrstuvwxyz');
    console.log('CHECK');
    console.log(decoded);
    console.log(decoded.user.id);

    if (decoded.user.id != null) {
      req.userid = decoded.user.id;
      next();
    } else {
      res.json('user not found');
    }
  }
};

Router.get('/all', (req, res) => {
  try {
    db.users
      .findAll()
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.statusCode(500).send({
          message: err.message || 'Some error occured while retrieving Users',
        });
      });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.put('/edit/:id', (req, res) => {
  try {
    const id = req.params.id;
    db.users
      .update(req.body, {
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: 'User was updated successfully.',
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating User with id=' + id,
        });
      });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.delete('/delete/:id', (req, res) => {
  try {
    const id = req.params.id;

    db.users
      .destroy({
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: 'User was deleted successfully!',
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Could not delete User with id=' + id,
        });
      });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.put('/changePassword', getTokenIdMiddleware, async (req, res) => {
  try {
    // Validate request
    const oldPassword = req.body.oldPassword;
    // Create a Category
    const credentials = {
      password: req.body.newPassword,
    };

    let projects2 = await db.sequelize.query(
      `Select password from users where id = ${req.userid};`,
      { try: QueryTypes.SELECT, model: db.users, mapToModel: true }
    );
    let myoldpassword = projects2[0].dataValues.password;

    if (bcrypt.compareSync(oldPassword, myoldpassword)) {
      let hash = await bcrypt.hash(credentials.password, saltRouds);
      credentials.password = hash;
      let projects3 = await db.sequelize.query(
        `Update users set password = '${credentials.password}' where id= ${req.userid};`
      );
      res.status(200).json({
        success: true,
        message: 'Password Successfully Changed',
      });
    } else {
      res.status(401).send({
        message: 'Wrong Old Password',
      });
    }
  } catch (ex) {
    res.status(500).send({
      success: false,
      message: ex.toString(),
    });
  }
});

module.exports = Router;
