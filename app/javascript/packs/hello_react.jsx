// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import moment from 'moment'

class SolarEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.calculateRemaining();
  }

  componentDidMount() {
    this.timerIntervalId = window.setInterval(() => {
      this.setState(this.calculateRemaining());
    }, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timerIntervalId);
  }

  calculateRemaining() {
    const now = moment();
    const futureTime = moment.unix(this.props.timestamp);

    return {
      remainingHours: futureTime.diff(now, 'hours'),
      remainingMinutes: (futureTime.diff(now, 'minutes') % 60)
    };
  }

  render() {
    return (
      <div className="solar-event">
        {this.props.type} in {this.state.remainingHours}h {this.state.remainingMinutes}m
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const data = document.data.solar;
  ReactDOM.render(<SolarEvent type={data.type} timestamp={data.timestamp} />, document.getElementById('react-solar'));
});
