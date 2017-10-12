import React from 'react'
import restful, { fetchBackend } from 'restful.js';

import _ from 'underscore'

export default class Links extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: true
    }

    const api = restful('http://' + window.location.host, fetchBackend(fetch)); // TODO: hacky
    this.collection = api.all('links'); 

    this.collection.getAll().then((response) => {
      let links = _.map(response.body(), (entity) => {
        return entity.data();
      });

      links = _.sortBy(links, 'position');

      this.setState({
        links: links
      });
    });
  }

  handleCreate(props) {
    alert(props);
  }

  render() {
    let links = [];
    if (this.state.links) {
      links = _.map(this.state.links, (link) => {
        return (
          <Link key={link.id} {...link}/>
        );
      });
    }

    let form = null;
    if (this.state.isEditing) {
      form = (<LinksForm onCreate={this.handleCreate.bind(this)} />);
    }

    return (
      <div>
        <div className="links-heading">Favorites</div>
        <div className="links">{links}</div>
        {form}
      </div>
    );
  }
}

function Link(props) {
  return (
    <a className="link" href={props.url}>
      <img className="link-image" src={props.image} />
      <div className="link-name">{props.name}</div>
    </a>
  );
}

// https://reactjs.org/docs/forms
class LinksForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.emptyState();
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.onCreate(this.state)

    this.setState(this.emptyState());
  }

  emptyState() {
    return {
      name: '',
      url: '',
      image: ''
    };
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    return (
      <form className="links-form" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" placeholder="name" name="name" value={this.state.name} onChange={this.handleChange.bind(this)} />
        <input type="text" placeholder="url" name="url" value={this.state.url} onChange={this.handleChange.bind(this)} />
        <input type="text" placeholder="icon url" name="image" value={this.state.image} onChange={this.handleChange.bind(this)} />
        <button type="submit">+</button>
      </form>
    );
  }
}
