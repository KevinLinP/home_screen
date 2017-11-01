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

// i'm going to hell.
const updateFuncFor = (linksField) => {
  return (store, response) => {
    const links = response.data[linksField];

    const data = store.readQuery({ query: linksQuery });
    data.links = links;
    store.writeQuery({ query: linksQuery, data});
  } ;
};

const createLinkOptions = {
  props: ({ mutate }) => ({
    createLink: (input) => mutate({
      variables: input,
      update: updateFuncFor('createLink')
    })
  })
};

const deleteLink = gql`
mutation deleteLink($id: ID!) {
  deleteLink(id: $id) {
    id
    position
    name
    url
    image
  }
}
`;

const deleteLinkOptions = {
  props: ({ mutate }) => ({
    deleteLink: (id) => mutate({
      variables: {id: id},
      update: updateFuncFor('deleteLink')
    })
  })
};

const LinksWithData = compose(
  graphql(deleteLink, deleteLinkOptions),
  graphql(createLink, createLinkOptions),
  graphql(linksQuery)
)(Links);

export default LinksWithData;
