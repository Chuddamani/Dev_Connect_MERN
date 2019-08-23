const mongoose = require('mongoose');

// config helps us get any configuration we do in default.json
const config = require('config');
const db = config.get('mongoURI');

//Connecting to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    console.log('Db Cnnected');
  } catch (err) {
    console.log(err.message);

    //Exit process on failure
    process.exit();
  }
};

module.exports = connectDB;
