import React from 'react'
import restful, { fetchBackend } from 'restful.js';
import _ from 'underscore'

import LinksForm from './links-form'

export default class Links extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      ...this.emptyFormProps()
    };

    this.handleIndexResponse = this.handleIndexResponse.bind(this);
    this.handleEditButtonOnClick = this.handleEditButtonOnClick.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);

    const api = restful('http://' + window.location.host, fetchBackend(fetch)); // TODO: hacky
    this.collection = api.all('links'); 

    this.collection.getAll().then(this.handleIndexResponse);
  }

  handleIndexResponse(response) {
    let links = _.map(response.body(), (entity) => {
      return entity.data();
    });

    links = _.sortBy(links, 'position');

    this.setState({
      links: links,
      ...this.emptyFormProps()
    });
  }

  emptyFormProps() {
    return {
      formName: '',
      formUrl: '',
      formImage: ''
    };
  }

  handleCreate() {
    this.collection.post(this.formProps()).then(this.handleIndexResponse);
  }

  handleDelete(id) {
    this.collection.delete(id).then(this.handleIndexResponse);
  }

  handleFormChange(field, value) {
    const stateFieldTable = {
      name: 'formName',
      url: 'formUrl',
      image: 'formImage',
    };

    this.setState({
      [stateFieldTable[field]]: value
    });
  }

  handleEditButtonOnClick() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  formProps() {
    return {
      name: this.state.formName,
      url: this.state.formUrl,
      image: this.state.formImage
    }
  }

  render() {
    let editButtonClass = 'links-edit-button';
    let links = [];
    if (this.state.links) {
      links = _.map(this.state.links, (link) => {
        return (
          <Link key={link.id} isEditing={this.state.isEditing} onDelete={() => {this.handleDelete(link.id)}} {...link}/>
        );
      });
    }

    let form = null;
    if (this.state.isEditing) {
      form = (<LinksForm onSubmit={this.handleCreate} onChange={this.handleFormChange} {...this.formProps()} />);
      editButtonClass += ' links-edit-button-editing'
    }

    return (
      <div>
        <div className="links-heading">
          <span className="links-heading-text">Favorites</span>
          <a href="javascript:void(0);" className={editButtonClass} onClick={this.handleEditButtonOnClick}>edit</a>
        </div>
        <div className="links">{links}</div>
        {form}
      </div>
    );
  }
}

function Link(props) {
  let editControls = null;
  if (props.isEditing) {
    editControls = (
      <div>
        <button className="link-delete-button" onClick={props.onDelete}><i className="fa fa-trash-o"></i></button>
      </div>
    );
  }

  return (
    <div className="link">
      <a className="link-link" href={props.url}>
        <img className="link-image" src={props.image} />
        <div className="link-name">{props.name}</div>
      </a>
      {editControls}
    </div>
  );
}
