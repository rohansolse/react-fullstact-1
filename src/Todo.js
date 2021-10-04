import React, { Component } from "react";
import TodoList from "./TodoList";

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            items: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({ text: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.state.text.length === 0) return;
        const newItem = {
            text: this.state.text,
            id: Date.now(),
        };
        this.setState((state) => ({
            items: state.items.concat(newItem),
            text: "",
        }));
    }
    S;
    render() {
        return (
            <div className="main">
                <h1>TODO Application</h1>
                <TodoList todoItems={this.state.items} />
                <form onSubmit={this.handleSubmit} action="">
                    <label htmlFor="">Input Item</label>
                    <input
                        id="id"
                        onChange={this.handleChange}
                        value={this.state.text}
                        type="text"
                    />
                    <button className="addButton">Add</button>
                </form>
            </div>
        );
    }
}
