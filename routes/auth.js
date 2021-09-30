const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "9fmq`qpA4uLJSj(m";

// Create a user using POST at the endpoint: /api/auth/create-user
router.post(
  "/create-user",
  [
    body("name", "Your name must be at least 3 characters long").isLength({
      min: 3,
    }),
    body("email", "Please enter a valid email address").isEmail(),
    body(
      "password",
      "Your password must be at least 6 characters long"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Check whether the user exists in DB
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "A user with that email already exists." });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // Creating a user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }
);

// User login using POST method at the endpoint: /api/auth/login
router.post(
  "/login",
  [
    body("email", "Please enter a valid email address").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Email/Password is incorrect!" });
      }

      let comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res
          .status(400)
          .json({ message: "Email/Password is incorrect!" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }
);

// Get user details using POST method at the endpoint: /api/auth/get-user
router.post("/get-user", async (req, res) => {

  try {
    let userId = "todo"
    const user = await User.findById(userId).select("-password")
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

module.exports = router;