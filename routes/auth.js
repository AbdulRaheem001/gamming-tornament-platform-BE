const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/loginAdmin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.email && password === process.env.password) {
      // Corrected token signing
      const tokenData = jwt.sign({}, process.env.SECRET); // Pass an empty object as the payload

      const data = {
        tokenData: tokenData,
      };
      console.log(data);
      res.status(201).json({ data });
    } else {
      return res.status(400).json({ error: "Invalid Cred" });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, country, phoneNumber, role } =
      req.body;
    console.log(req.body);
    // Validation
    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(
      password
    );

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !country ||
      !phoneNumber
    ) {
      return res.status(400).json({ error: "Missing Fields" });
    } else if (!isPasswordValid) {
      return res.status(401).json({ error: "Password Validation Failed" });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        country,
        phoneNumber,
        role,
      });

      await user.save();
      res.status(201).json({ data: user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, role } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({ error: "Missing Details" });
    } else {
      const user = await User.findOne({ email }).lean();
      if (user && user.role === role) {
        // console.log("user found");
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (passwordCompare == true) {
          const tokenData = jwt.sign(user, process.env.SECRET);
          const data = {
            user: user,
            tokenData: tokenData,
          };
          
          console.log(data);
          res.status(201).json({ data });
        } else {
          return res.status(400).json({ error: "Password" });
        }
      } else {
        res.status(404).json({ error: "Email Not Found" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});
router.get("/organizerName", (req, res) => {
  const organizerID = req.params.organizerID;
  console.log(organizerID);
  const organizer = User.find({organizerID});
  console.log(organizer);
  if (organizer) {
    res.json({ name: organizer.firstName +' '+ organizer.lastName });
  } else {
    res.status(404).json({ error: "Organizer not found" });
  }
});
module.exports = router;
