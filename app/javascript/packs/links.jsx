import React from 'react'
import _ from 'underscore'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Links extends React.Component {
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

const LinksList = SortableContainer((props) => {
  const links = _.map(props.links, (link) => {
    const sortableElementProps = {
      disabled: !props.showEditControls
    };

    const linkProps = {
      ...link,
      key: link.id,
      index: link.position,
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

const linksQuery = gql`
query {
  links {
    id
    position
    name
    url
    image
  }
}`;

const LinksWithData = graphql(linksQuery)(Links);

export default LinksWithData;
