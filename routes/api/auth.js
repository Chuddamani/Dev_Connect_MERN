const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route  GET api/user
// @desc   Test Route
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

module.exports = router;
