const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User.js');

// @route  POST api/user
// @desc   Test Route
// @access Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Pleae enter a password with 6 or more characters')
      .not()
      .isEmpty()
      .isLength({ mim: 6, max: 20 })
  ],
  async (req, res) => {
    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    //Getting data from the body
    const { name, email, password } = req.body;

    try {
      //See if user Exists
      let user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Users Already Exists' }] });
      }

      // Getting user's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // Since user is new we will create the User Object
      user = new User({
        name,
        email,
        password,
        avatar
      });

      //Encrpt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //Saving user in DB
      await user.save();

      // Return JSON Token
      const payload = {
        user: {
          // Adding the complete user object in payload + adding id field to it
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 300000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //res.send('User Registered');
    } catch (err) {
      console.log(err.message);
      res.send(500).send('Internal Server Error');
    }
    //
  }
);

module.exports = router;
