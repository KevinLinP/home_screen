import React from 'react'
import restful, { fetchBackend } from 'restful.js';
import _ from 'underscore'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import LinksForm from './links-form'

export default class Links extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      links: [],
      showEditControls: false,
      form: this.emptyFormProps()
    };

    this.handleIndexResponse = this.handleIndexResponse.bind(this);
    this.handleEditToggle = this.handleEditToggle.bind(this);
    this.handleLinkEditButton = this.handleLinkEditButton.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleSortEnd = this.handleSortEnd.bind(this);
    this.resetForm = this.resetForm.bind(this);

    const api = restful(window.location.protocol + '//' + window.location.host, fetchBackend(fetch)); // TODO: hacky
    this.collection = api.all('links'); 

    this.collection.getAll().then(this.handleIndexResponse);
  }

  handleIndexResponse(response) {
    let links = _.map(response.body(), (entity) => {
      let data = entity.data();
      data.index = data.position;
      delete data.position;

      return data;
    });
    links = _.sortBy(links, 'index');

    this.setState({
      links: links,
    });
  }

  resetForm() {
    this.setState({
      form: this.emptyFormProps()
    });
  }

  emptyFormProps() {
    return {
      name: '',
      url: '',
      image: ''
    };
  }

  handleFormSubmit() {
    let data = this.state.form;
    let promise;

    if (data.id) {
      const id = data.id;
      data = _.pick(data, 'name', 'url', 'image');

      promise = this.collection.patch(id, data);
    } else {
      promise = this.collection.post(data);
    }

    promise.then(this.handleIndexResponse).then(this.resetForm);
  }

  handleLinkEditButton(link) {
    if (link.id == this.state.form.id) {
      this.resetForm();
    } else {
      this.setState({form: link});
    }
  }

  handleDelete(link) {
    this.collection.delete(link.id).then(this.handleIndexResponse);
  }

  handleFormChange(field, value) {
    this.setState({
      form: Object.assign({}, this.state.form, {[field]: value})
    });
  }

  handleEditToggle() {
    var newState = !this.state.showEditControls;
    this.setState({
      showEditControls: newState
    });

    if (!newState && this.state.form.id) {
      this.resetForm();
    }
  }

  handleSortEnd({oldIndex, newIndex}) {
    if (newIndex == oldIndex) {
      return;
    }

    const link = this.state.links[oldIndex];

    this.setState({
      links: arrayMove(this.state.links, oldIndex, newIndex) // doesn't update .index, only returns new array with reordered items
    });

    this.collection.patch(link.id, {position: newIndex}).then(this.handleIndexResponse);
  }

  render() {
    let form = null;
    let editButtonClass = 'links-edit-button';
    if (this.state.showEditControls) {
      form = (<LinksForm onSubmit={this.handleFormSubmit} onChange={this.handleFormChange} {...this.state.form} />);
      editButtonClass += ' links-edit-button-editing';
    }

    const sortableContainerSettings = {
      axis: 'xy'
    };
    const linksListProps = {
      links: this.state.links,
      showEditControls: this.state.showEditControls,
      onLinkEditButton: this.handleLinkEditButton,
      onDelete: this.handleDelete,
      onSortEnd: this.handleSortEnd,
      ...sortableContainerSettings
    };

    return (
      <div>
        <div className="links-heading">
          <span className="links-heading-text">Favorites</span>
          <a href="javascript:void(0);" className={editButtonClass} onClick={this.handleEditToggle}>edit</a>
        </div>
        <LinksList {...linksListProps}/>
        {form}
      </div>
    );
  }
}

const LinksList = SortableContainer((props) => {
  const links = _.map(props.links, (link) => {
    const sortableElementProps = {
      disabled: !props.showEditControls
    };

    const linkProps = {
      ...link,
      key: link.id,
      showEditControls: props.showEditControls,
      onEdit: () => {props.onLinkEditButton(link);},
      onDelete: () => {props.onDelete(link);},
      ...sortableElementProps
    };

    return (
      <Link {...linkProps} />
    );
  });

  return (<div className="links">{links}</div>);
});

const Link = SortableElement((props) => {
  let editControls = null;
  if (props.showEditControls) {
    editControls = (
      <div className="link-edit-controls">
        <button className="link-edit-button" onClick={props.onEdit}>
          <i className="fa fa-pencil-square-o"></i>
        </button>
        <button className="link-delete-button" onClick={props.onDelete}>
          <i className="fa fa-trash-o"></i>
        </button>
      </div>
    );
  }

  return (
    <div className="link">
      <a className="link-link" href={props.url}>
        <div className="link-image-container">
          <img className="link-image" src={props.image} />
        </div>
        <div className="link-name">{props.name}</div>
      </a>
      {editControls}
    </div>
  );
});
