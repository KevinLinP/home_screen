import React from 'react'
import ReactDOM from 'react-dom'

import DaylightInfo from './daylight-info'
import Clock from './clock'
import Weather from './weather'
import Todo from './todo'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<DaylightInfo events={document.data.daylightInfo} />, document.getElementById('react-daylight-info'));
  ReactDOM.render(<Clock/>, document.getElementById('react-clock'));
  ReactDOM.render(<Weather/>, document.getElementById('react-weather'));
  ReactDOM.render(<Todo items={document.data.todo} />, document.getElementById('react-todo'));
});
