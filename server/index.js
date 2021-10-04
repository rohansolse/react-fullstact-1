const express = require("express");
const app = express();
app.use(express.json());
const port = 4000;
const books = [
    {
        title: "java program",
        id: 1,
    },
    {
        title: "c program",
        id: 2,
    },
    {
        title: "c++ program",
        id: 3,
    },
];

app.get("/", (req, res) => {
    res.send("Hello its working...");
});

app.get("/api/books", (req, res) => {
    res.send(books);
});

app.get("/api/books/:id", (req, res) => {
    const book = books.find((item) => item.id === Number(req.params.id));
    if (!book) {
        res.status(404).send("books not found");
    } else {
        res.send(book);
    }
});

app.post("/api/books/:id", (req, res) => {
    const book = {
        id: books.length + 1,
        title: req.body.title,
    };
    books.push(book);
    res.send(books);
});

app.put("/api/books/:id", (req, res) => {
    const book = books.find((item) => item.id === Number(req.params.id));
    if (!book) {
        res.status(404).send("books not found");
    } else {
        book.title = req.body.title;
        res.send(book);
    }
});

app.delete("/api/books/:id", (req, res) => {
    const book = books.find((item) => item.id === Number(req.params.id));
    if (!book) {
        res.status(404).send("books not found");
    } else {
        var bookIndex = books.indexOf(book);
        books.splice(bookIndex, 1);
        res.send(books);
    }
});

app.listen(port, () => {
    console.log("its running ...");
});
