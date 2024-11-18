const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return !users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user;

    if (!review) {
        return res.status(400).json({ error: "Review content is required" });
    }

    const book = Object.values(books).find(book => book.isbn === parseInt(isbn));

    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    if (!book.reviews) {
        book.reviews = {};
    }
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user;

    const book = Object.values(books).find(book => book.isbn === parseInt(isbn));

    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ error: "No review found for this user on this book" });
    }

    delete book.reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
