const express = require('express');
const router = express.Router();
const Support = require('../models/support.cjs');
require('dotenv').config();


router.post('/', async (req, res) => {
   const { email, desc } = req.body;
   try {
      const support = await Support.create({ email, desc });
      res.status(201).json(support);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;
