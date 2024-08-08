const express = require('express');
const router = express.Router();
const User = require('../models/user.cjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/', (req, res) => {

   User.find().then(users => {
      res.json(users);
   }).catch(err => {
      res.status(500).json({ message: err.message });
   });

});
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

router.post('/', async (req, res) => {
   const { name, desc, pw, color, en, bug, donator, rank, game, discord, discord2, xb, ps, ig } = req.body;
   try {
      const user = await User.create({ name, desc, pw, color, en, bug, donator, rank, game, discord, discord2, xb, ps, ig });
      const payload = {
         name: user.name,
         isLoggedIn: true
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60d' });
      res.status(201).json({ user, token });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});
// Add this to your users.cjs file




module.exports = router;
