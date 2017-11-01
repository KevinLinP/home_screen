import React from 'react'
import {SortableElement} from 'react-sortable-hoc';

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

export default Link;
