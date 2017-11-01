import React from 'react'
import _ from 'underscore'
import {arrayMove} from 'react-sortable-hoc';

import LinksList from './links-list'
import LinksForm from './links-form'

export default class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditControls: false
    }
  }

  render() {
    let links = this.props.data.links;
    if (!links) {
      links = [];
    }

    let form = null;
    let editButtonClass = 'homescreen-header-edit-toggle';
    if (this.state.showEditControls) {
      form = (<LinksForm onSubmit={this.handleFormSubmit} onChange={this.handleFormChange} {...this.state.form} />);
      editButtonClass += ' active';
    }

    const sortableContainerSettings = {
      axis: 'xy'
    };
    const linksListProps = {
      links,
      showEditControls: this.state.showEditControls,
      onLinkEditButton: this.handleLinkEditButton,
      onDelete: this.handleDelete,
      onSortEnd: this.handleSortEnd,
      ...sortableContainerSettings
    };

    return (
      <div>
        <div className="homescreen-header">
          Favorites
          <a href="javascript:void(0);" className={editButtonClass} onClick={this.handleEditToggle}>edit</a>
        </div>
        <LinksList {...linksListProps}/>
        {form}
      </div>
    );
  }
}
