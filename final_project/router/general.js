const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send("Incomplete Data");
  }

  if (isValid(username)) {
    return res.status(404).send("User already exists");
  }

  users.push({ username: username, password: password });
  return res.status(200).send("Added Successfully");
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  if (!books[req.params.isbn]) {
    return res.status(404).send("Invalid ID");
  }
  return res.status(200).send(JSON.stringify(books[req.params.isbn], null, 4));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  if (!req.params.author) {
    return res.status(404).send("No author provided!");
  }
  for (let id in books) {
    if (books[id].author === req.params.author) {
      return res.status(200).send(JSON.stringify(books[id], null, 4));
    }
  }
  return res.status(404).send("Author not found!");
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  if (!req.params.title) {
    return res.status(404).send("No title provided!");
  }
  for (let id in books) {
    if (books[id].title === req.params.title) {
      return res.status(200).send(JSON.stringify(books[id], null, 4));
    }
  }
  return res.status(404).send("Book not found!");
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  if (!books[req.params.isbn]) {
    return res.status(404).send("Invalid ID");
  }
  return res
    .status(200)
    .send(JSON.stringify(books[req.params.isbn].reviews, null, 4));
});

async function getBooks() {
  try {
    const response = await axios.get("http://localhost:5000/");
    console.log("Books (All):");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching all books:", error.message);
  }
}

async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Book details for ISBN ${isbn}:`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
  }
}

async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(`Books by author "${author}":`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
  }
}

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(`Books with title "${title}":`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching books with title ${title}:`, error.message);
  }
}

module.exports.general = public_users;
