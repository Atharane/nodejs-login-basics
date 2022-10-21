const fs = require("fs");
const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const axios = require("axios");

// const initializePassport = require("./passport-config");
// initializePassport(
//   passport,
//   (email) => users.find((user) => user.email === email),
//   (id) => users.find((user) => user.id === id)
// );

const app = express();
const port = 3000;

// init
mongoose.connect(
  "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.fpahzfp.mongodb.net/?retryWrites=true&w=majority"
);
// use collection users
const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
});

app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static("css"));

app.get("/", (req, res) => {
  res.send(fs.readFileSync("html/dashboard.html").toString());
});

app.get("/login", (req, res) => {
  res.send(fs.readFileSync("html/login.html").toString());
});

app.get("/register", (req, res) => {
  res.send(fs.readFileSync("html/register.html").toString());
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user == null) {
      return res.redirect("/login"); 
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.redirect("/");
    }
    else {
      res.send("Not Allowed");
    }
  } catch {
    res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  try {
    // add users to database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}/login`);
});

app.use((err, req, res, next) => {
  res.status(500).send("Something broke :( Please try again.");
});


/*
 TODO:
 set up session
 handle direct access to /dashboard
 handle logout
 dispaly user name on dashboard
*/
