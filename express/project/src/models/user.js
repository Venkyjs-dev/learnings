const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    secondName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about you",
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/026/434/417/original/default-avatar-profile-icon-of-social-media-user-photo-vector.jpg",
    },
    skills: [String],
    default: ["javascript", "react js"],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
