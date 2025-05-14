require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
 
const app = express();
 
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
 
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile); // Send user profile to session
}));
 
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
 

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
 
app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "http://localhost:3000/adhome",
  })
);
 
app.get("/hello", (req, res) => {
  res.send("Hello World");
});
 
app.get("/auth/user", (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.status(200).json({ user: req.user });
});
 
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.redirect("http://localhost:3000");
  });
});
 
app.get("/auth/failure", (req, res) => {
  res.send("Login Failed");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
