import React from 'react'
import restful, { fetchBackend } from 'restful.js';
import _ from 'underscore'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import LinksForm from './links-form'

export default class Links extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      links: [],
      ...this.emptyFormProps()
    };

    this.handleIndexResponse = this.handleIndexResponse.bind(this);
    this.handleEditButtonOnClick = this.handleEditButtonOnClick.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSortEnd = this.handleSortEnd.bind(this);

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

  emptyFormProps() {
    return {
      formName: '',
      formUrl: '',
      formImage: ''
    };
  }

  handleCreate() {
    this.collection.post(this.formProps())
      .then(this.handleIndexResponse)
      .then(() => {
        this.setState({
          ...this.emptyFormProps()
        })
      });
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
      axis: 'xy',
      shouldCancelStart: () => {
        return !this.state.isEditing
      }
    };

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
        <LinksList links={this.state.links} onSortEnd={this.handleSortEnd} isEditing={this.state.isEditing} onDelete={this.handleDelete} {...sortableContainerSettings}/>
        {form}
      </div>
    );
  }
}

// starting to look like callback hell
const LinksList = SortableContainer((props) => {
  const links = _.map(props.links, (link) => {
    return (
      <Link key={link.id} {...link} isEditing={props.isEditing} onDelete={() => {props.onDelete(link.id);}}/>
    );
  });

  return (<div className="links">{links}</div>);
});

const Link = SortableElement((props) => {
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
        <div className="link-image-container">
          <img className="link-image" src={props.image} />
        </div>
        <div className="link-name">{props.name}</div>
      </a>
      {editControls}
    </div>
  );
});
