const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route  GET api/user
// @desc   Get the user after verification
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    //getting the user by his Id But we don,t want to return the password so user "-password"
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error');
  }
});

// @route  POST api/auth
// @desc   Authenticate User and get Token
// @access Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'password is required').exists()
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
    const { email, password } = req.body;

    try {
      //See if user Exists based on email
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // validating if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

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
      res.status(500).send('Internal Server Error');
    }
  }
);

module.exports = router;
