import React from 'react'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Links from './links'

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
