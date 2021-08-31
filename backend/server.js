const express = require('express');
const formData = require('express-form-data');
const cors = require('cors');

const jwt = require('jsonwebtoken');

var app = express();
const db = require('./models');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');

var bcrypt = require('bcrypt');
var saltRouds = 10;
const { QueryTypes } = require('sequelize');
var CryptoJS = require('crypto-js');

const nodemailer = require('nodemailer');
const { REGISTRATION_DOMAIN, SMTP_USER, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } =
  process.env;
console.log({
  REGISTRATION_DOMAIN,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_HOST,
  SMTP_PORT,
});

const transporter = nodemailer.createTransport({
  port: SMTP_PORT,
  host: SMTP_HOST,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

// app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(formData.parse(options));

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Connected!`);
  });
});

// const server = app.listen(PORT, () => {
//   console.log(`Connected!`, PORT);
// });

app.post('/signin', async (req, res) => {
  try {
    var user = {};
    user.email = req.body.email;
    user.password = req.body.password;

    let findUser = await db.users.findOne({
      where: {
        email: req.body.email,
      },
      // raw: true,
    });
    console.log(findUser);
    if (findUser == null) {
      res.status(500).json({
        message: 'User Does Not exists...',
      });
      return;
    }
    if (findUser.dataValues.isVerified != true) {
      res.status(500).json({
        success: false,
        message: 'User is not Verified',
      });
      return;
    } else {
      if (bcrypt.compareSync(user.password, findUser.password)) {
        const { password, ...user } = findUser.dataValues;
        console.log({ user });
        let token = jwt.sign({ user }, 'abcdefghijklmnopqrstuvwxyz');
        res.status(200).json({
          token,
          user,
        });
      } else {
        res.status(401).send({
          message: 'User Unauthorized Access',
        });
      }
    }
  } catch (ex) {
    res.status(500).send({
      success: false,
      message: ex.toString(),
    });
  }
});

app.post('/signup', async (req, res) => {
  try {
    // Validate request
    if (!req.body.email) {
      res.status(400).send({
        message: 'Please Enter Email',
      });
      return;
    } else if (!req.body.password) {
      res.status(400).send({
        message: 'Please Enter Password',
      });
      return;
    }
    const extension = REGISTRATION_DOMAIN;
    if (extension) {
      const userEmail = req.body.email;
      let user2 = userEmail.split('@');
      const domain = user2[1];
      console.log(domain, extension);
      if (domain != extension) {
        res.status(500).json({
          success: false,
          message: 'Invalid Domain',
        });
        return;
      }
    }
    // Create a Category
    const credentials = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    };
    let findUser = await db.users.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (findUser != null) {
      res.status(500).send({
        message: 'User already exists...',
      });
      return;
    } else {
      let hash = await bcrypt.hash(credentials.password, saltRouds);
      console.log('else');
      credentials.password = hash;
      findUser = await db.users.create(credentials);
      console.log(findUser.dataValues.id);
      var ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(findUser.dataValues.id),
        'qazxsw!@#edcvfr)(*'
      ).toString();
      const { password, ...user } = findUser.dataValues;
      console.log({ user });
      const url = 'http://localhost:8100/verify/';
      const mailData = {
        from: SMTP_USER,
        to: req.body.email,
        subject: 'Verify Email',
        text: 'Verification Link',
        html: `<b>Hey there! </b><br> Please <a target='_blank' href='${url}${ciphertext}'>Click Here!</a> to verify your email
                 <br/>`,
      };
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: error,
          });
        } else {
          res.json({
            success: true,
            message: 'A verification link has been sent to your email',
          });
        }
      });
    }
  } catch (ex) {
    res.status(500).send({
      success: false,
      message: ex.toString(),
    });
  }
});

app.put('/verifyEmail', async (req, res) => {
  try {
    userId = req.body.id;
    var myuser = CryptoJS.AES.decrypt(userId, 'qazxsw!@#edcvfr)(*');
    var originalText = myuser.toString(CryptoJS.enc.Utf8);

    let findUser = await db.users.findOne({
      where: {
        id: originalText,
      },
    });

    console.log({ findUser, originalText });

    if (findUser.dataValues.isVerified) {
      res.json({
        success: true,
        message: 'Email is Already Verified',
      });
      return;
    } else {
      const obj = {
        isVerified: true,
      };
      db.users
        .update(obj, {
          where: { id: originalText },
        })
        .then((num) => {
          if (num == 1) {
            res.json({
              success: true,
              message: 'Email Successfully Verified',
            });
          } else {
            res.status(500).json({
              success: false,
              message: `Cannot Verify Email`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: 'Error Verifying Email',
          });
        });
    }
  } catch (ex) {
    res.status(500).send({
      success: false,
      message: ex.toString(),
    });
  }
});

app.put('/forget-password', async (req, res) => {
  try {
    let findUser = await db.users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (findUser == null) {
      res.status(500).send({
        message: 'User Does Not exists...',
      });
      return;
    } else if (!findUser.dataValues.isVerified) {
      res.status(500).send({
        message: 'Email is not verified, please verify email',
      });
      return;
    } else {
      const newobj = {
        id: findUser.id,
        expiry: Date.now(),
      };
      var encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(newobj),
        'qazxsw!@#edcvfr)(*'
      ).toString();

      const url = 'http://localhost:8100/reset/';
      const mailData = {
        from: SMTP_USER,
        to: req.body.email,
        subject: 'Forgot Password',
        text: 'Reset Link',
        html: `<b>Hey there! </b><br> Please <a target='_blank' href='${url}${encryptedUser}'>Click Here!</a> to reset your password
                 <br/>`,
      };
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: error,
          });
        } else {
          res.json({
            success: true,
            message: 'A reset link has been sent to your email',
          });
        }
      });
    }
  } catch (ex) {
    res.status(500).send({
      success: false,
      message: ex.toString(),
    });
  }
});

app.put('/reset-password', async (req, res) => {
  try {
    const newPassword = req.body.password;
    let userObj = req.body.id;
    var bytes = CryptoJS.AES.decrypt(userObj, 'qazxsw!@#edcvfr)(*');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData.id);
    console.log(decryptedData.expiry);

    if (decryptedData.expiry > Date.now() + 1 * 60 * 60 * 1000) {
      res.json({
        success: false,
        message: 'The Link Has Expired',
      });
    } else {
      let findUser = await db.users.findOne({
        where: {
          id: decryptedData.id,
        },
      });
      bcrypt.hash(newPassword, saltRouds).then((hashedpassword) => {
        findUser.password = hashedpassword;
        findUser.save().then((saveduser) => {
          res.json({
            success: true,
            message: 'password updated success',
          });
        });
      });
    }
  } catch (ex) {
    res.status(500).send({
      success: false,
      message: ex.toString(),
    });
  }
});

const authenticateMiddleware = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  //Check if bearer is undefined

  if (typeof bearerHeader !== 'undefined') {
    //Split at the space
    const bearer = bearerHeader.split(' ');
    //Get token from array
    const bearerToken = bearer[1];
    //Set the token
    req.token = bearerToken;
    //Next middlware
    jwt.verify(req.token, 'abcdefghijklmnopqrstuvwxyz', (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};

const UserRoutes = require('./routes/users');
const PostRoutes = require('./routes/posts');
const RatingRoutes = require('./routes/ratings');
const CommentRoutes = require('./routes/comments');

app.use('/users', UserRoutes);
app.use('/posts', authenticateMiddleware, PostRoutes);
app.use('/ratings', authenticateMiddleware, RatingRoutes);
app.use('/comments', authenticateMiddleware, CommentRoutes);

// app.listen(3000);

// 160.119.254.32

//npx sequelize-auto -o "./models" -d social_media -h 160.119.254.32 -u root -p 3306 -x malik200 -e mysql
