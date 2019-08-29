const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route  POST api/posts
// @desc   Create a Post
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
      //   ,check('comments.text', 'Text is required')
      //     .not()
      //     .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route  GET api/posts
// @desc   Create a Post
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal Server Error');
  }
});

// @route  GET api/posts/:id
// @desc   Create a Post
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).send('Post Not Found');
    }

    res.json(post);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).send('Post Not Found');
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route  DELETE api/posts/:id
// @desc   Delete a Post
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ msg: 'Post Not Found' });
    }

    // Check if user is authorized to delete the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send('User not Authorized');
    }

    //await Post.findByIdAndRemove({ _id: post.id });
    await post.remove();

    res.json({ msg: 'Post deleted Successfully' });
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post Not Found' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route  PUT api/posts/:id
// @desc   Like a Post
// @access Private
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: 'Post Not Found' });
    }

    //Check if Post has already been liked by the User
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post Already Lioked' });
    }

    //Add like to the post
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).send('Post Not Found');
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route  PUT api/posts/unlike/:id
// @desc   Like a Post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if Post has already been liked by the User
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    //Remove like to the post
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).send('Post Not Found');
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route  POST api/posts/comment/:id
// @desc  Give comment to a post
// @access Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
      //   ,check('comments.text', 'Text is required')
      //     .not()
      //     .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const comment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      };

      post.comments.unshift(comment);
      await post.save();

      return res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route  DELETE api/posts/comment/:post_id/:comment_id
// @desc  delete a comment
// @access Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    //Pull out the Comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(400).json({ msg: 'Comment does not exists' });
    }

    //Check user -> the User who made comment must be able to delete it
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User not authorized to delete Comment' });
    }

    //Remove commnet to the post
    const removeIndex = post.comments
      .map(comment => comment.id === req.params.comment_id)
      .indexOf(comment.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    return res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
