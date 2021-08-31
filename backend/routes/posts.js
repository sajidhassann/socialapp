const express = require('express');
const Router = express.Router();
const db = require('../models');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const { encrypt } = require('../common/Hash');

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

Router.get('/get', getTokenIdMiddleware, async (req, res) => {
  try {
    const authorid = req.userid;
    let projects = await db.sequelize.query(
      `Select id ,mood ,
          message ,createdAt,updatedAt
          from posts where author_uid = ${authorid};`,
      { try: QueryTypes.SELECT, model: db.posts, mapToModel: true }
    );
    if (projects.length > 0) {
      res.send(projects);
    } else {
      res.send('Could Not Find Any Posts for this User');
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.get('/all', async (req, res) => {
  try {
    let projects = await db.sequelize.query(
      `Select id ,mood ,
      message 
      ,createdAt,updatedAt
      from posts;`,
      { try: QueryTypes.SELECT, model: db.posts, mapToModel: true }
    );
    if (projects.length > 0) {
      res.send(projects);
    } else {
      res.send('Could Not Retrieve Any Posts');
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.post('/create', getTokenIdMiddleware, (req, res) => {
  try {
    let userid = req.userid;
    userid = encrypt(userid, 'qazxsw!@#edcvfr)(*');

    if (!req.body.message) {
      res.status(400).send({
        message: 'Please Enter Some Text',
      });
      return;
    }

    // Create a User
    const user = {
      message: req.body.message,
      author_uid: userid,
    };
    if (req.body.mood) {
      user.mood = req.body.mood;
    }

    // Save User in the database
    db.posts
      .create(user)
      .then((data) => {
        data = data.toJSON();
        delete data.author_uid;
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the Posts.',
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
    db.posts
      .findAll({
        where: {
          id: req.params.id,
        },
      })
      .then((post) => {
        res.send(post);
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving Post with id=' + id,
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

    db.posts
      .destroy({
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: 'Post was deleted successfully!',
          });
        } else {
          res.send({
            message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Could not delete Post with id=' + id,
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
    db.posts
      .update(req.body, {
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: 'Post was updated successfully.',
          });
        } else {
          res.send({
            message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating Post with id=' + id,
        });
      });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.get('/getEverything', getTokenIdMiddleware, async (req, res) => {
  try {
    let userid = req.userid;
    userid = encrypt(userid, 'qazxsw!@#edcvfr)(*');

    let posts = await db.sequelize.query(
      `select  DATE_FORMAT(p.createdAt, '%m/%d/%Y') as date,p.id , p.mood 
    ,p.message , p.createdAt,p.updatedAt,
    (select count(*) from ratings r1 where rating = 1 and r1.posts_id = p.id) 
    as Likes,(select count(*) from ratings r2 where rating = -1 and r2.posts_id = p.id
    ) as
    Dislikes from posts p where p.createdAt BETWEEN NOW() - INTERVAL 14 DAY AND NOW() order by p.createdAt DESC;`,
      { try: QueryTypes.SELECT, model: db.comments, mapToModel: true }
    );

    let comments = await db.sequelize.query(
      `select  DATE_FORMAT(createdAt, '%m/%d/%Y') as date, id, 
    posts_id , message , pseudonyms,
    isAuthor,createdAt,updatedAt from comments where createdAt BETWEEN NOW() - INTERVAL 14 DAY AND NOW();`,
      { try: QueryTypes.SELECT, model: db.comments, mapToModel: true }
    );
    let rated = await db.sequelize.query(
      `select rating,id,posts_id from ratings r where users_id= '${userid}' and r.createdAt BETWEEN NOW() - INTERVAL 14 DAY AND NOW() order by r.createdAt DESC;;`,
      {
        try: QueryTypes.SELECT,
        model: db.comments,
        mapToModel: true,
      }
    );
    // let rated = await db.ratings.findAll({
    //   attributes:['rating','posts_id','id'],
    //   where:{
    //     users_id:userid,

    //   }
    // })
    res.json({ posts, comments, rated });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.get('/getPostRating/:id', async (req, res) => {
  try {
    let projects = await db.sequelize.query(
      `select count(*) as Dislikes,(Select count(*)  
    from ratings where rating = 1 and posts_id=${req.params.posts_id}) as
     Likes from ratings where rating =-1 and posts_id =${req.params.posts_id};`,
      { try: QueryTypes.SELECT, model: db.comments, mapToModel: true }
    );
    res.json(projects[0]);
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

module.exports = Router;
