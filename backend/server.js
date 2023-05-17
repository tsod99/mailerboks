var express = require("express");
var env = require("dotenv").config();
var app = express();
var cors = require("cors");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

const User = require("./user");
app.use(cors());

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  const user = new User({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
  });

  user.save((err) => {
    if (err) {
      console.error("Error saving user:", err);
      return res.status(500).json({ error: "An error occurred" });
    }
    return res.json({ message: "Signup successful" });
  });
});

app.use(bodyParser.json());
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).json({ error: "An error occurred" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ token });
  });
});

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = decodedToken.userId;
    next();
  });
};

app.get("/dashboard", isAuthenticated, (req, res) => {
  User.findById(req.userId, (err, user) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).json({ error: "An error occurred" });
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const greeting = `Welcome to the dashboard, ${user.firstName}!`;

    return res.json({ message: greeting });
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server is started on http://127.0.0.1:" + PORT);
});
