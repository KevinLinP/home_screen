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

// i'm going to hell.
const updateFuncFor = (linksField) => {
  return (store, response) => {
    const links = response.data[linksField];

    const data = store.readQuery({ query: linksQuery });
    data.links = links;
    store.writeQuery({ query: linksQuery, data});
  };
};

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

const updateLink = gql`
mutation updateLink($id: ID!, $name: String, $url: String, $image: String) {
  updateLink(id: $id, name: $name, url: $url, image: $image) {
    id
    position
    name
    url
    image
  }
}
`;

const updateLinkOptions = {
  props: ({ mutate }) => ({
    updateLink: (id, fields) => mutate({
      variables: {id: id, ...fields},
      update: updateFuncFor('updateLink')
    })
  })
};

const repositionLink = gql`
mutation repositionLink($id: ID!, $newPosition: Int!) {
  repositionLink(id: $id, newPosition: $newPosition) {
    id
    position
    name
    url
    image
  }
}
`;

const repositionLinkOptions = {
  props: ({ mutate }) => ({
    repositionLink: (id, newPosition) => mutate({
      variables: {id: id, newPosition: newPosition},
      update: updateFuncFor('repositionLink')
    })
  })
};

const LinksWithData = compose(
  graphql(repositionLink, repositionLinkOptions),
  graphql(deleteLink, deleteLinkOptions),
  graphql(updateLink, updateLinkOptions),
  graphql(createLink, createLinkOptions),
  graphql(linksQuery)
)(Links);

export default LinksWithData;
