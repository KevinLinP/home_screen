import React from 'react'
import { connect, PromiseState } from 'react-refetch'

import _ from 'underscore'

class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: true
    }
  }

  handleCreate(props) {
    alert(props);
  }

  render() {
    const { linksFetch } = this.props;

    if (!linksFetch.fulfilled) {
      return null;
    }

    let links = linksFetch.value;
    links = _.sortBy(links, 'position');
    links = _.map(links, (link) => {
      return (
        <Link key={link.id} {...link}/>
      );
    });

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

export default connect(props => ({
  linksFetch: {
    url: '/links'
  }
}))(Links)
