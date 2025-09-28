const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  const res = users.filter((user) => user.username === username);
  return res.length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.

  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(404).send("Incomplete data");
  }
  if (authenticatedUser(req.body.username, req.body.password)) {
    let access = jwt.sign({ username: req.body.username }, "very_secret", {
      expiresIn: "1h",
    });
    req.session.auth = { user: req.body.username, token: access };
    return res.status(200).send("Logged in successfully");
  }

  return res.status(404).send("User does not exist");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let id = req.params.isbn;
  if (!id || !books[id]) {
    return res.status(404).send("invalid id");
  }
  if (!req.query.review) {
    return res.status(404).send("no review supplied");
  }
  if (id && req.query.review) {
    books[id]["reviews"][req.session.user] = req.query.review;
    return res.status(200).send("review added");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (req.params.isbn) {
    delete books[req.params.isbn]["reviews"][req.session.user];
    return res.status(200).send("deleted successfully");
  }
  return res.status(404).send("No ID provided");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
