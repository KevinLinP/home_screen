import React from 'react'

import _ from 'underscore'

export default class Todo extends React.Component {
  render() {
    let items = _.sortBy(this.props.items, 'position');
    items = _.map(items, function(item) {
      return (<TodoItem key={item.id} {...item} />);
    });

    return (
      <div>
        <div className="todo-heading">Reminders</div>
        <ul className="todo-list">{items}</ul>
      </div>
    );
  }
}

function TodoItem(props) {
  return (<li className="todo-item">{props.text}</li>);
}
