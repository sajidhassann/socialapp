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

Router.get('/get', getTokenIdMiddleware, (req, res) => {
  try {
    const userid = req.userid;
    db.ratings
      .findAll({
        where: {
          author_uid: userid,
        },
      })
      .then((cat) => {
        if (cat.length == 0) {
          res.status(500).send({
            message: 'The ratings with id=' + authorid + ' Does Not Exist',
          });
        } else {
          res.send(cat);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving ratings with id=' + authorid,
        });
      });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.get('/all', (req, res) => {
  try {
    db.ratings
      .findAll()
      .then((rating) => {
        res.send(rating);
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

Router.post('/add', getTokenIdMiddleware, (req, res) => {
  try {
    const userid = req.userid;

    // Create a User
    const rating = {
      posts_id: req.body.posts_id,
      users_id: userid,
      rating: req.body.rating,
    };
    // Save User in the database
    db.ratings
      .create(rating)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the ratings.',
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
    db.ratings
      .findAll({
        where: {
          id: req.params.id,
        },
      })
      .then((rating) => {
        res.send(rating);
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving rating with id=' + id,
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

    db.ratings
      .destroy({
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: 'rating was deleted successfully!',
          });
        } else {
          res.send({
            message: `Cannot delete rating with id=${id}. Maybe rating was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Could not delete rating with id=' + id,
        });
      });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

Router.put('/edit/:id', getTokenIdMiddleware, async (req, res) => {
  try {
    let users_id = req.userid;
    users_id = encrypt(users_id, 'qazxsw!@#edcvfr)(*');

    const posts_id = req.params.id;
    const ratingObj = {
      posts_id,
      users_id,
      rating: req.body.rating,
    };
    const checkRating = await db.ratings.findAll({
      where: {
        users_id,
        posts_id,
      },
    });
    const checkRating2 = await db.ratings.findAll();
    console.log({
      checkRating,
      checkRating2: checkRating2.map((val) => val.dataValues),
    });
    if (checkRating.length === 0) {
      const rating = await db.ratings.create(ratingObj);
    } else {
      let projects = await db.sequelize
        .query(`Update ratings set rating = ${req.body.rating} 
        where users_id= '${users_id}' and posts_id = ${posts_id};`);
    }
    res.json({
      success: true,
      message: 'Rating Updated Successfully',
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString(),
    });
  }
});

// Router.put("/edit/:id", getTokenIdMiddleware, async (req, res) => {
//     try {
//         const users_id = req.userid;
//         const posts_id = req.params.id;
//         console.log("USER " + users_id)
//         console.log("POST " + posts_id)
//         console.log("RATING " + req.body.rating)
//         let projects = (await db.sequelize.query(`Update ratings set rating = ${req.body.rating}
//         where users_id= ${users_id} and posts_id = ${req.params.id};`));
//         res.json({
//             success: true,
//             message: "Rating Updated Successfully"
//         })
//     }
//     catch (e) {
//         res.status(500).send({
//             success: false,
//             message: e.toString()
//         })
//     }
// });

Router.get('/getByPostID/:id', async (req, res) => {
  try {
    let projects = await db.sequelize.query(
      `select count(*) as Dislikes,(Select count(*)  
    from ratings where rating = 1 and posts_id=${req.params.id}) as
     Likes from ratings where rating =-1 and posts_id =${req.params.id};`,
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

Router.get(
  '/getRatingByPostAndUserID/:id',
  getTokenIdMiddleware,
  async (req, res) => {
    try {
      const userid = req.userid;
      let projects = await db.sequelize.query(
        `select * from ratings
        where users_id=${userid} and posts_id=${req.params.id};`,
        {
          try: QueryTypes.SELECT,
          model: db.comments,
          mapToModel: true,
        }
      );
      res.json(projects[0]);
    } catch (e) {
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  }
);

module.exports = Router;
