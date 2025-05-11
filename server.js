require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Your React frontend
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/adhome", // Redirect URL after login
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile); // Send user profile to session
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "http://localhost:3000/adhome", // React route after login
  })
);

app.get("/auth/user", (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.status(200).json({ user: req.user });
});

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000");
  });
});

app.get("/auth/failure", (req, res) => {
  res.send("Login Failed");
});

// Start Server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:5000"));