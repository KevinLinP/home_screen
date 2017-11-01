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

const createLink = gql`
mutation createLink($name: String!, $url: String!, $image: String!) {
  createLink(name: $name, url: $url, image: $image) {
    id
    position
    name
    url
    image
  }
}
`;

const createLinkOptions = {
  props: ({ mutate }) => ({
    createLink: (input) => mutate({variables: input})
  })
};

const deleteLink = gql`
mutation deleteLink($id: ID!) {
  deleteLink(id: $id)
}
`;

const deleteLinkOptions = {
  props: ({ mutate }) => ({
    deleteLink: (id) => mutate({variables: {id: id}})
  })
};

const LinksWithData = compose(
  graphql(deleteLink, deleteLinkOptions),
  graphql(createLink, createLinkOptions),
  graphql(linksQuery)
)(Links);

export default LinksWithData;
