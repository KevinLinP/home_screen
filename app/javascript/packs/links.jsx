import React from 'react'
import restful, { fetchBackend } from 'restful.js';
import _ from 'underscore'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import LinksForm from './links-form'

export default class Links extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditControls: false,
      links: [],
      ...this.emptyFormProps()
    };

    this.handleIndexResponse = this.handleIndexResponse.bind(this);
    this.handleEditButtonOnClick = this.handleEditButtonOnClick.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
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
      ...this.emptyFormProps()
    });
  }

  emptyFormProps() {
    return {
      form: {
        name: '',
        url: '',
        image: ''
      }
    };
  }

  handleSubmit() {
    let data = this.state.form;
    let promise;

    if (data.id) {
      const id = data.id;
      data = {
        name: data.name,
        url: data.url,
        image: data.image
      };

      promise = this.collection.patch(id, data);
    } else {
      promise = this.collection.post(data);
    }

    promise.then(this.handleIndexResponse).then(this.resetForm);
  }

  handleEdit(link) {
    if (link.id == this.state.form.id) {
      this.resetform();
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

  handleEditButtonOnClick() {
    var newState = !this.state.showEditControls;
    this.setState({
      showEditControls: newState
    });

    if (!newState) {
      this.resetForm();
    }
  }

  handleSortEnd({oldIndex, newIndex}) {
    const link = this.state.links[oldIndex];

    // arrayMove doesn't update .index, just changes position of items ... I think
    this.setState({
      links: arrayMove(this.state.links, oldIndex, newIndex)
    });

    this.collection.patch(link.id, {position: newIndex}).then(this.handleIndexResponse);
  }

  render() {
    let editButtonClass = 'links-edit-button';

    let sortableContainerSettings = {
      axis: 'xy'
    };

    let form = null;
    if (this.state.showEditControls) {
      form = (<LinksForm onSubmit={this.handleSubmit} onChange={this.handleFormChange} {...this.state.form} />);
      editButtonClass += ' links-edit-button-editing';
    }

    return (
      <div>
        <div className="links-heading">
          <span className="links-heading-text">Favorites</span>
          <a href="javascript:void(0);" className={editButtonClass} onClick={this.handleEditButtonOnClick}>edit</a>
        </div>
        <LinksList links={this.state.links} onSortEnd={this.handleSortEnd} showEditControls={this.state.showEditControls} onEdit={this.handleEdit} onDelete={this.handleDelete} {...sortableContainerSettings}/>
        {form}
      </div>
    );
  }
}

const LinksList = SortableContainer((props) => {
  const links = _.map(props.links, (link) => {
    const linkProps = {
      key: link.id,
      ...link,
      showEditControls: props.showEditControls,
      disabled: !props.showEditControls,
      onEdit: () => {props.onEdit(link);},
      onDelete: () => {props.onDelete(link);}
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
