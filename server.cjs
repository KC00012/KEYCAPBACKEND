const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

const users = require('./routes/users.cjs');
const posts = require('./routes/posts.cjs');
const supports = require('./routes/supports.cjs');


const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors()); // Apply CORS middleware

app.use((req, res, next) => {
   console.log("Request received");
   next();
});

app.use('/registracija', users);
app.use('/saigraci', users);
app.use('/nalog', users);
app.use('/forum', posts);
app.use("/podrska", supports)
app.use("/profil/:id", users)
app.use('/forum/:id', posts);
app.use("/prijava", users)



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
      app.listen(port, () => {
         console.log(`Server running on port ${port}`);
      });
   })
   .catch((error) => {
      console.error('Database connection error:', error);
   });
