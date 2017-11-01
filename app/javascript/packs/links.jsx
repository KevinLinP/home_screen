import React from 'react'
import _ from 'underscore'
import {arrayMove} from 'react-sortable-hoc';

import LinksList from './links-list'
import LinksForm from './links-form'

export default class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditControls: false,
      form: this.emptyFormProps()
    }
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

  handleFormChange(field, value) {
    this.setState({
      form: Object.assign({}, this.state.form, {[field]: value})
    });
  }

  handleFormSubmit() {
    let data = this.state.form;
    let promise;

    if (data.id) {
      //const id = data.id;
      //data = _.pick(data, 'name', 'url', 'image');

      //promise = this.collection.patch(id, data);
    } else {
      promise = this.props.createLink(data);
    }

    //promise.then(this.resetForm.bind(this));
    promise.then(({ data }) => {
      console.log('got data', data);
    }).catch((error) => {
      console.log('there was an error sending the query', error);
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

  handleDelete(link) {
    this.props.deleteLink(link.id);
  }

  render() {
    let links = this.props.data.links;
    if (!links) {
      links = [];
    }

    let form = null;
    let editButtonClass = 'homescreen-header-edit-toggle';
    if (this.state.showEditControls) {
      form = (<LinksForm onSubmit={this.handleFormSubmit.bind(this)} onChange={this.handleFormChange.bind(this)} {...this.state.form} />);
      editButtonClass += ' active';
    }

    const sortableContainerSettings = {
      axis: 'xy'
    };
    const linksListProps = {
      links,
      showEditControls: this.state.showEditControls,
      onLinkEditButton: this.handleLinkEditButton,
      onDelete: this.handleDelete.bind(this),
      onSortEnd: this.handleSortEnd,
      ...sortableContainerSettings
    };

    return (
      <div>
        <div className="homescreen-header">
          Favorites
          <a href="javascript:void(0);" className={editButtonClass} onClick={this.handleEditToggle.bind(this)}>edit</a>
        </div>
        <LinksList {...linksListProps}/>
        {form}
      </div>
    );
  }
}
