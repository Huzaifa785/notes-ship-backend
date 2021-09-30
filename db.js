const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/notes-ship"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to MongoDB successfully...");
    })
}

module.exports = connectToMongo