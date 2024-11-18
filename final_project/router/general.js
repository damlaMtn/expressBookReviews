const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

public_users.get('/books', async (req, res) => {
    try {
        const getBooks = new Promise((resolve) => {
            resolve(books);
        });
        const result = await getBooks;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching the book list" });
    }
});


public_users.get('/books/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const getBookByISBN = new Promise((resolve, reject) => {
            const book = Object.values(books).find(book => book.isbn === parseInt(isbn));
            if (book) resolve(book);
            else reject("Book not found");
        });
        const result = await getBookByISBN;
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error });
    }
});

public_users.get('/books/author/:author', (req, res) => {
    const { author } = req.params;
    const getBooksByAuthor = new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter(book => book.author === author);
        if (booksByAuthor.length > 0) resolve(booksByAuthor);
        else reject("Author not found");
    });

    getBooksByAuthor
        .then(result => res.status(200).json(result))
        .catch(error => res.status(404).json({ error }));
});

public_users.get('/books/title/:title', (req, res) => {
    const { title } = req.params;
    // Simulating async operation with a Promise
    const getBookByTitle = new Promise((resolve, reject) => {
        const bookByTitle = Object.values(books).find(book => book.title === title);
        if (bookByTitle) resolve(bookByTitle);
        else reject("Title not found");
    });

    getBookByTitle
        .then(result => res.status(200).json(result))
        .catch(error => res.status(404).json({ error }));
});

module.exports.general = public_users;