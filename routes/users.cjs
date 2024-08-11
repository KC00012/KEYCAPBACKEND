const express = require('express');
const router = express.Router();
const User = require('../models/user.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

// Register a new user with password hashing
router.post('/', async (req, res) => {
   const { name, pw } = req.body;

   if (req.originalUrl === '/registracija') {
      // Registration logic
      const { desc, color, en, bug, donator, rank, game, discord, discord2, xb, ps, ig } = req.body;

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
            bug,
            donator,
            rank,
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

         res.status(200).json({ user, token });
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
