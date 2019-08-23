const express = require('express');

// Got the refrence to the  exported module in db.js
const connectDB = require('./config/db');
connectDB();

const app = express();

const port = process.env.PORT || 5000; //No port defined it would go to 5000
app.listen(port, () => console.log(`Server Started on PORT ${port}`));

// Just to check is server is up and running
app.get('/', (req, res) => res.send('API Running'));

//Init Middleware to handle json request
app.use(express.json({ extended: false }));

//Defining Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post', require('./routes/api/post'));
