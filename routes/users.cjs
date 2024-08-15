const express = require('express');
const router = express.Router();
const User = require('../models/user.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper function to validate fields
function validateFields(fields) {
   const { name, desc, pw, color, en, bug, donator, rank, game, discord, discord2, xb, ps, ig } = fields;

   if (!name || !desc || !pw || !color || !en || !game) {
      return "Name, description, password, color, English language, and game fields are required.";
   }

   if (typeof bug !== 'boolean' || bug !== false) {
      return "Bug must be set to false on account creation.";
   }

   if (typeof donator !== 'boolean' || donator !== false) {
      return "Donator must be set to false on account creation.";
   }

   if (rank !== 'default') {
      return "Rank must be set to 'default' on account creation.";
   }

   // At least one of these fields must be provided
   if (!discord && !discord2 && !xb && !ps && !ig) {
      return "At least one of the following fields is required: Discord, Discord2, Xbox, PlayStation, Instagram.";
   }

   return null;
}

// Get all users
router.get('/', (req, res) => {
   User.find().then(users => {
      res.json(users);
   }).catch(err => {
      res.status(500).json({ message: err.message });
   });
});

// Get a user by ID
router.get('/:_id', (req, res) => {
   const id = req.params._id;
   console.log(`Received GET request for ID: ${id}`);

   User.findById(id).then(user => {
      if (!user) {
         res.status(404).json({ message: 'User not found' });
      } else {
         res.json(user);
      }
   }).catch(err => {
      res.status(500).json({ message: err.message });
   });
});

// Register a new user with password hashing and validation
router.post('/', async (req, res) => {
   const { name, pw, desc, color, en, game, discord, discord2, xb, ps, ig } = req.body;

   if (req.originalUrl === '/registracija') {
      // Registration logic with validation
      const validationError = validateFields({
         name, desc, pw, color, en, game, bug: false, donator: false, rank: 'default', discord, discord2, xb, ps, ig
      });

      if (validationError) {
         return res.status(400).json({ message: validationError });
      }

      try {
         // Check if the username already exists
         const existingUser = await User.findOne({ name });
         if (existingUser) {
            console.log(`Username "${name}" already exists.`);
            return res.status(400).json({ message: "Username already exists" });
         }

         // Hash the password before saving
         const hashedPassword = await bcrypt.hash(pw, 10);
         const user = await User.create({
            name,
            desc,
            pw: hashedPassword, // Save the hashed password
            color,
            en,
            bug: false, // Set default values
            donator: false,
            rank: 'default',
            game,
            discord,
            discord2,
            xb,
            ps,
            ig
         });

         const payload = {
            name: user.name,
            isLoggedIn: true
         };
         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60d' });

         res.status(201).json({ user, token });
      } catch (error) {
         res.status(500).json({ error: error.message });
      }

   } else if (req.originalUrl === '/prijava') {
      // Login logic
      try {
         const user = await User.findOne({ name });
         if (!user) {
            return res.status(404).json({ message: 'User not found' });
         }

         // Compare the provided password with the hashed password in the database
         const isMatch = await bcrypt.compare(pw, user.pw);
         if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
         }

         const payload = {
            name: user.name,
            isLoggedIn: true
         };
         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60d' });
         res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'Strict', // Prevent CSRF
            maxAge: 60 * 60 * 24 * 60 * 1000 // 60 days
         });
         res.status(200).json({ user });

      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   } else {
      // Handle cases where the route doesn't match
      res.status(404).json({ message: 'Invalid route' });
   }
});

router.put("/:id", async (req, res) => {
   const { name } = req.body;

   try {
      // Check if the username already exists and belongs to a different user
      const existingUser = await User.findOne({ name });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
         console.log(`Username "${name}" already exists.`);
         return res.status(400).json({ message: "Username already exists" });
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
         new: true, // Return the updated document
         runValidators: true, // Run schema validators 
      });

      if (!updatedUser) {
         return res.status(404).send("User not found");
      }
      const payload = {
         name: name,
         isLoggedIn: true
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60d' });
      res.json({ updatedUser, token });
   } catch (error) {
      console.error("Error updating user data", error);
      res.status(500).send("Server error");
   }
});


module.exports = router;
