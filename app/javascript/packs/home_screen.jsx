import React from 'react'
import ReactDOM from 'react-dom'

import DaylightInfo from './daylight-info'
import Clock from './clock'
import Weather from './weather'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<DaylightInfo events={document.data.daylightInfo} />, document.getElementById('react-daylight-info'));
  ReactDOM.render(<Clock/>, document.getElementById('react-clock'));
  ReactDOM.render(<Weather/>, document.getElementById('react-weather'));
});
