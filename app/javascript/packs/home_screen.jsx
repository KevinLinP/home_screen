import React from 'react'
import ReactDOM from 'react-dom'

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import DaylightInfo from './daylight-info'
import Clock from './clock'
import Weather from './weather'
//import Todo from './todo'
import NicehashStats from './nicehash-stats'
import LinksWithData from './links-with-data'
import RedditTldr from './reddit-tldr'
import UpcomingEvents from './upcoming-events'

document.addEventListener('DOMContentLoaded', () => {
  const client = new ApolloClient({
    link: new HttpLink(),
    cache: new InMemoryCache()
  });

  ReactDOM.render(<DaylightInfo/>, document.getElementById('react-daylight-info'));
  ReactDOM.render(<Clock/>, document.getElementById('react-clock'));
  ReactDOM.render(<Weather/>, document.getElementById('react-weather'));
  ReactDOM.render((<NicehashStats/>), document.getElementById('react-nicehash-stats'));
  ReactDOM.render((
    <ApolloProvider client={client}>
      <LinksWithData/>
    </ApolloProvider>
  ), document.getElementById('react-links'));
  ReactDOM.render(<RedditTldr/>, document.getElementById('react-reddit-tldr'));
  ReactDOM.render(<UpcomingEvents/>, document.getElementById('react-upcoming-events'));
});
