const express = require('express');
const router = express.Router();
const Post = require('../models/post.cjs');
require('dotenv').config();

// Helper function to validate post fields
function validatePostFields(fields) {
   const { title, desc, by, theme } = fields;

   if (!title || !desc || !by || !theme) {
      return "Title, description, author (by), and theme are required fields.";
   }

   return null;
}

// Get all posts
router.get('/', (req, res) => {
   Post.find()
      .then(posts => {
         res.json(posts);
      })
      .catch(err => {
         res.status(500).json({ message: err.message });
      });
});

// Create a new post with validation
router.post('/', async (req, res) => {
   const { title, desc, by, theme, comments } = req.body;

   // Validate fields
   const validationError = validatePostFields({ title, desc, by, theme });
   if (validationError) {
      return res.status(400).json({ message: validationError });
   }

   try {
      const post = await Post.create({ title, desc, by, theme, comments: comments || [] });
      res.status(201).json(post);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get a post by ID
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

// Add a comment to a post with validation
router.post('/:id/comments', async (req, res) => {
   const { id } = req.params;
   const { text, by } = req.body;

   // Validate comment fields
   if (!text || !by) {
      return res.status(400).json({ message: "Text and author (by) are required fields for a comment." });
   }

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
