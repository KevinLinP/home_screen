import React from 'react'
import _ from 'underscore'
import {SortableContainer} from 'react-sortable-hoc';

import Link from './link'

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

export default LinksList;
