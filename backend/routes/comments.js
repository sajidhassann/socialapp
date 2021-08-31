const express = require('express');
const Router = express.Router();
const db = require('../models');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');

const nicknames = require('nicknames');

const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator');
const e = require('cors');
const { encrypt } = require('../common/Hash');

nicknames.femaleRandom();

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

Router.get('/get', getTokenIdMiddleware, (req, res) => {
  try {
    const authorid = req.userid;
    db.comments
      .findAll({
        where: {
          users_id: authorid,
        },
      })
      .then((cat) => {
        if (cat.length == 0) {
          res.status(500).send({
            message: 'The comments with id=' + authorid + ' Does Not Exist',
          });
        } else {
          res.send(cat);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving comments with id=' + authorid,
        });
      });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.get('/getByPostID/:id', async (req, res) => {
  try {
    const postid = req.params.id;
    let projects = await db.sequelize.query(
      `Select id , message ,createdAt,updatedAt,posts_id ,
            pseudonyms,
            isAuthor from comments where posts_id = ${postid};`,
      { try: QueryTypes.SELECT, model: db.comments, mapToModel: true }
    );
    // if(projects.length>0){
    res.json(projects);
    // }
    // else{
    //     res.send("Could Not Find Comments for this post")
    // }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.get('/all', (req, res) => {
  try {
    db.comments
      .findAll()
      .then((comment) => {
        res.send(comment);
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

Router.post('/post', getTokenIdMiddleware, async (req, res) => {
  try {
    let userid = req.userid;
    userid = encrypt(userid, 'qazxsw!@#edcvfr)(*');

    let projects = await db.sequelize.query(
      `Select pseudonyms from comments where users_id= '${userid}' and posts_id = ${req.body.posts_id};`,
      { try: QueryTypes.SELECT, model: db.comments, mapToModel: true }
    );
    console.log(
      `Select pseudonyms from comments where users_id='${userid}' and posts_id = ${req.body.posts_id};`,
      `Select pseudonyms from comments where users_id=${userid} and posts_id = ${req.body.posts_id};`,
      { projects }
    );

    var pseudonyms;
    if (projects.length == 0) {
      //pseudonyms = nicknames.allRandom();
      pseudonyms = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        style: 'capital',
        separator: ' ',
      });
    } else {
      pseudonyms = projects[0].pseudonyms;
    }
    //Create a Comment
    const comment = {
      message: req.body.message,
      users_id: userid,
      pseudonyms: pseudonyms,
      posts_id: req.body.posts_id,
    };
    if (req.body.mood) {
      user.mood = req.body.mood;
    }
    let projects2 = await db.sequelize.query(
      `Select author_uid from posts where id = ${req.body.posts_id};`,
      { try: QueryTypes.SELECT, model: db.comments, mapToModel: true }
    );
    let result = projects2[0].dataValues.author_uid;
    console.log(result);
    if (result == userid) {
      comment.isAuthor = true;
    } else {
      comment.isAuthor = false;
    }

    // Save User in the database
    db.comments
      .create(comment)
      .then((data) => {
        data = data.toJSON();
        delete data.users_id;
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while posting the Comments.',
        });
      });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.get('/find/:id', (req, res) => {
  try {
    db.comments
      .findAll({
        where: {
          posts_id: req.params.id,
        },
      })
      .then((comment) => {
        res.send(comment);
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving comment with id=' + id,
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

    db.comments
      .destroy({
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: 'comment was deleted successfully!',
          });
        } else {
          res.send({
            message: `Cannot delete comment with id=${id}. Maybe comment was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Could not delete comment with id=' + id,
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
    db.comments
      .update(req.body, {
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: 'comment was updated successfully.',
          });
        } else {
          res.send({
            message: `Cannot update comment with id=${id}. Maybe comment was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating comment with id=' + id,
        });
      });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

module.exports = Router;
