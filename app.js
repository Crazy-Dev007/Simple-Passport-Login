require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const expressSession = require("express-session");
const expressLayout = require("express-ejs-layouts");
const { connectdb, User } = require("./models/user");
const { initpassport, isAuth } = require("./passsport.config");

const app = express();
const port = process.env.PORT || 3000;

// DB
connectdb();

//  passport
initpassport(passport);

// flash

// logger
app.use(morgan("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: "pain",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// template engine
app.set("view engine", "ejs");
app.set("layout", "layouts/layout.ejs");
app.use(expressLayout);

// Endpoints
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureMessage: "invalid Login Check Username And Password",
    failureRedirect: "/login",
    successRedirect: "/dashboard",
  })
);

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/dashboard", isAuth, (req, res) => {
  console.log(req.user);
  res.render("dashboard", { user: req.user });
});

app.post("/register", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already exists");
  const newuser = await User.create(req.body);
  newuser.save();
  console.log(newuser);
  res.status(200).render("dashboard", newuser);
});

app.get("/logout", (req, res) => {
  req.logOut();
  //   await req.flash("info", "Your logged out");
  res.redirect("/");
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
