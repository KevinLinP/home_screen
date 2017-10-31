import React from 'react'
import ReactDOM from 'react-dom'

import DaylightInfo from './daylight-info'
import Clock from './clock'
import Weather from './weather'
//import Todo from './todo'
import NicehashStats from './nicehash-stats'
import Links from './links'
import RedditTldr from './reddit-tldr'
import UpcomingEvents from './upcoming-events'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<DaylightInfo/>, document.getElementById('react-daylight-info'));
  ReactDOM.render(<Clock/>, document.getElementById('react-clock'));
  ReactDOM.render(<Weather/>, document.getElementById('react-weather'));
  //ReactDOM.render(<Todo items={document.data.todo} />, document.getElementById('react-todo'));
  ReactDOM.render(<NicehashStats/>, document.getElementById('react-nicehash-stats'));
  ReactDOM.render(<Links/>, document.getElementById('react-links'));
  ReactDOM.render(<RedditTldr/>, document.getElementById('react-reddit-tldr'));
  ReactDOM.render(<UpcomingEvents/>, document.getElementById('react-upcoming-events'));
});
