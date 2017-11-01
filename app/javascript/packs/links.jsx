import React from 'react'
import _ from 'underscore'

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class LinksList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let links = this.props.data.links;
    if (!links) {
      return null;
    }

    links = _.map(links, (link) => {
      return (<li key={link.id}>{link.name}</li>);
    });

    return (
      <ul>
        {links}
      </ul>
    );
  }
}

const linksListQuery = gql`
query {
  links {
    id
    name
    url
    image
  }
}`;

const LinksListWithData = graphql(linksListQuery)(LinksList);

export default LinksListWithData;
