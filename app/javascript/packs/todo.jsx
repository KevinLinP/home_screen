import React from 'react'

import _ from 'underscore'

export default class Todo extends React.Component {
  constructor(props) {
    let state = {
      items: props.items
    }
    // delete props.items; // TODO

    super(props);

    this.state = state;
  }

  handleCreate(data) {
    const lastPosition = _.max(this.state.items, (item) => {
      return item.position;
    }).position;

    data.position = lastPosition + 1;
    data.id = 'tmp' + (new Date).valueOf();

    // TODO: persist to server

    this.setState({
      items: this.state.items.concat([data])
    });
  }

  render() {
    let items = _.sortBy(this.state.items, 'position');
    items = _.map(items, function(item) {
      return (<TodoItem key={item.id} {...item} />);
    });

    return (
      <div>
        <div className="homescreen-header">Reminders</div>
        <ul className="todo-list">{items}</ul>
        <TodoForm onCreate={this.handleCreate.bind(this)} />
      </div>
    );
  }
}

function TodoItem(props) {
  return (<li className="todo-item">{props.text}</li>);
}

// https://reactjs.org/docs/forms
class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.onCreate(this.state)

    this.setState({
      text: ''
    });
  }

  handleChange(event) {
    this.setState({
      text: event.target.value
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" value={this.state.text} onChange={this.handleChange.bind(this)} />
        <input type="submit" value="+" />
      </form>
    );
  }
}
