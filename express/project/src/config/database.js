const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devi131780_db_user:NzbVB4SW5wK9uJ6j@first-cluster.wdgczms.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
