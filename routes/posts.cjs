const express = require('express');
const router = express.Router();
const Post = require('../models/post.cjs');
require('dotenv').config();

router.get('/', (req, res) => {

   Post.find().then(posts => {
      res.json(posts);
   }).catch(err => {
      res.status(500).json({ message: err.message });
   });

});

router.post('/', async (req, res) => {
   const { title, desc, by, theme, comments } = req.body;
   try {
      const post = await Post.create({ title, desc, by, theme, comments });
      res.status(201).json(post);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});
router.get('/:id', async (req, res) => {
   const { id } = req.params;
   try {
      const post = await Post.findById(id);
      if (!post) {
         return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});
router.post('/:id/comments', async (req, res) => {
   const { id } = req.params;
   const { text, by } = req.body;

   try {
      const post = await Post.findById(id);
      if (!post) {
         return res.status(404).json({ message: 'Post not found' });
      }

      post.comments.push({ text, by });
      await post.save();

      res.status(201).json(post);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;
