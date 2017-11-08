import React from 'react'
import _ from 'underscore'
import {arrayMove} from 'react-sortable-hoc';

import LinksList from './links-list'
import LinksForm from './links-form'

export default class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [],
      showEditControls: false,
      form: this.emptyFormProps()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.state.links, nextProps.data.links)) {
      this.setState({
        links: nextProps.data.links
      });
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

  handleFormSubmit() {
    let data = this.state.form;
    let promise;

    if (data.id) {
      const id = data.id;
      data = _.pick(data, 'name', 'url', 'image');

      promise = this.props.updateLink(id, data);
    } else {
      promise = this.props.createLink(data);
    }

    promise.then(this.resetForm.bind(this));
  }

  handleLinkEditButton(link) {
    if (link.id == this.state.form.id) {
      this.resetForm();
    } else {
      this.setState({form: link});
    }
  }

  handleDelete(link) {
    this.props.deleteLink(link.id);
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

    this.props.repositionLink(link.id, newIndex);
  }

  render() {
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
      links: this.state.links,
      showEditControls: this.state.showEditControls,
      onLinkEditButton: this.handleLinkEditButton.bind(this),
      onDelete: this.handleDelete.bind(this),
      onSortEnd: this.handleSortEnd.bind(this),
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
