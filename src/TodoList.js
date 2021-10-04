import React, { Component } from "react";

export default class TodoList extends Component {
    render() {
        return (
            <div>
                <ul>
                    {this.props.todoItems.map((item) => (
                        <li key={item.id}>{item.text}</li>
                    ))}
                </ul>
            </div>
        );
    }
}
