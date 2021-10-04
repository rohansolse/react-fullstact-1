import React, { Component } from "react";

export default class Books extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allBooks: [],
            singleBook: {
                name: "",
                id: 0,
            },
            isUpdated: false,
        };
        this.getAllBooks = this.getAllBooks.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBook = this.handleBook.bind(this);
        this.updateBook = this.updateBook.bind(this);
        this.handleBookUpdate = this.handleBookUpdate.bind(this);
        this.deteleBook = this.deteleBook.bind(this);
    }
    getAllBooks() {
        fetch("http://localhost:4000/api/books")
            .then((res) => res.json())
            .then((result) => {
                this.setState({
                    allBooks: result.result,
                    isUpdated: false,
                });
            })
            .catch(console.log);
    }
    handleChange(e) {
        let oldIsupdateState = this.state.isUpdated;
        this.setState({
            singleBook: {
                name: e.target.value,
                id: this.state.singleBook.id,
            },
            isUpdated: oldIsupdateState,
        });
    }
    handleBookUpdate() {
        console.log("handleBookUpdate");
        console.log(this.state.isUpdated);
        fetch("http://localhost:4000/api/books/" + this.state.singleBook.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.singleBook),
        }).then((result) => {
            this.setState({
                singleBook: {
                    name: "",
                },
                isUpdated: false,
            });
            this.getAllBooks();
        });
    }
    updateBook(e, id) {
        fetch("http://localhost:4000/api/books/" + id)
            .then((res) => res.json())
            .then((result) => {
                this.setState({
                    singleBook: {
                        name: result.result.name,
                        id: id,
                    },
                    isUpdated: true,
                });
                console.log(this.state.isUpdated);
            });
    }
    deteleBook(id) {
        console.log("nooke od ", id);
        fetch("http://localhost:4000/api/books/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                this.getAllBooks();
            });
    }
    handleBook() {
        console.log("handleBook");
        console.log(this.state.isUpdated);
        fetch("http://localhost:4000/api/books/addBook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.singleBook),
        }).then(
            this.setState({
                singleBook: {
                    name: "",
                },
                isUpdated: false,
            })
        );
    }
    render() {
        return (
            <div className="container">
                <button
                    className="btn btn-primary mx-2 my-2"
                    type="button"
                    onClick={this.getAllBooks}
                >
                    Get Books
                </button>
                <button
                    className="btn btn-info my-2"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={this.addNewBook}
                >
                    Add Book
                </button>

                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.allBooks.map((book) => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.name}</td>
                                <td>
                                    <button
                                        className="btn btn-info"
                                        type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={(e) =>
                                            this.updateBook(e, book.id)
                                        }
                                    >
                                        Update Book
                                    </button>
                                    <button
                                        className="btn btn-danger mx-2"
                                        type="button"
                                        onClick={() => this.deteleBook(book.id)}
                                    >
                                        Delete Book
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div
                    className="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title"
                                    id="exampleModalLabel"
                                >
                                    Modal title
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <label htmlFor="name" className="mx-2">
                                    Enter Book Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={this.state.singleBook.name}
                                    onChange={this.handleChange}
                                ></input>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={
                                        this.state.isUpdated === true
                                            ? this.handleBookUpdate
                                            : this.handleBook
                                    }
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
