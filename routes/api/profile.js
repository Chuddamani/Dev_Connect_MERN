const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  GET api/profile/me
// @desc   Get Curent User profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate(
      'user', // Getting user from Profile refrence field
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for the User' });
    }
    res.json(profile);
  } catch (err) {
    return res.status(500).send('Intrnal Server Error');
  }
});

// @route  POST api/profile
// @desc   Create OR Update Profile
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),

      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // BUild Social Objet
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.youtube = facebook;
    if (twitter) profileFields.social.youtube = twitter;
    if (instagram) profileFields.social.youtube = instagram;
    if (linkedin) profileFields.social.youtube = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // If profile exists we UPDATE
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Create a new Profile
      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route  POST api/profile
// @desc   Get All Profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    let profiles = await Profile.find().populate('user', [
      'name',
      'email',
      'avatar'
    ]); //Populate is done add username and avatar Url in the response
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal Server Error');
  }
});

// @route  POST api/profile/user/:user_id
// @desc   Get Profile by User id
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'email', 'avatar']);

    if (!profile)
      return res.status(400).json({ msg: 'No Profile for this User' });

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No Profile for this User' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route  DELETE api/profile
// @desc   Delete a Profile , user and Posts
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Successfully Removed' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal Server Error');
  }
});

// @route  PUT api/profile/experience
// @desc   Add Profile Experience
// @access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From Date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete an experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get the index to be deleted
    const remoneIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    //Deleting the profile
    profile.experience.splice(remoneIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal Server Error');
  }
});

// @route  PUT api/profile/education
// @desc   Add Profile Education
// @access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'fieldofstudy  is required')
        .not()
        .isEmpty(),
      check('from', 'From Date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route  DELETE api/profile/education/:edu_id
// @desc   Delete an education
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get the index to be deleted
    const remoneIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    //Deleting the profile
    profile.education.splice(remoneIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
