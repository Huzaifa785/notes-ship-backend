const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectToMongo = () => {
  mongoose.connect(process.env.MONGO_DB_URL, () => {
    console.log("Connected to MongoDB successfully...");
  });
};

module.exports = connectToMongo;
