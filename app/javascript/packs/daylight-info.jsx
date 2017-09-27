import React from 'react'

import _ from 'underscore'
import moment from 'moment'

export default class DaylightInfo extends React.Component {
  render() {
    const events = _.filter(this.props.events, (event) => {
      return event.timestamp >= (new Date()).getTime();
    });
    const event = _.first(events);

    return (
      <DaylightEvent type={event.type} timestamp={event.timestamp} />
    );
  }
}

class DaylightEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.calculateRemaining();
  }

  componentDidMount() {
    this.timerIntervalId = window.setInterval(() => {
      this.setState(this.calculateRemaining());
    }, 5000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timerIntervalId);
  }

  calculateRemaining() {
    const now = moment();
    const futureTime = moment(this.props.timestamp);

    return {
      remainingHours: futureTime.diff(now, 'hours'),
      remainingMinutes: (futureTime.diff(now, 'minutes') % 60)
    };
  }

  render() {
    return (
      <div className="daylight-event">
        {this.props.type} in {this.state.remainingHours}h {this.state.remainingMinutes}m
      </div>
    );
  }
}
