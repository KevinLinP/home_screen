import React from 'react'

import _ from 'underscore'
import moment from 'moment'

export default class DaylightInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEvent: this.currentEvent()
    };
  }

  refresh() {
    this.setState({
      currentEvent: this.currentEvent()
    });
  }

  currentEvent() {
    const now = moment();

    const events = _.filter(this.props.events, (event) => {
      return moment(event.timestamp).isAfter(now);
    });

    return _.first(events);
  }

  render() {
    // https://facebook.github.io/react/docs/jsx-in-depth.html#spread-attributes
    return (
      <DaylightEvent {...this.state.currentEvent} pastEvent={this.refresh.bind(this)}/>
    );
  }
}

class DaylightEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...this.calculateRemaining()};
  }

  componentDidMount() {
    this.timerIntervalId = window.setInterval(this.refresh.bind(this), 5000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timerIntervalId);
  }

  refresh() {
    this.setState(this.calculateRemaining());
  }

  calculateRemaining() {
    const now = moment();
    const futureTime = moment(this.props.timestamp);

    if (now.isAfter(futureTime)) {
      this.props.pastEvent();
    }

    return {
      remainingHours: futureTime.diff(now, 'hours'),
      remainingMinutes: (futureTime.diff(now, 'minutes') % 60)
    };
  }

  render() {
    return (
      <div className="daylight-event">
        <span className={'daylight-event-' + this.props.type}>{this.props.type}</span>
        <span> in </span>
        <span className="daylight-event-time">{this.state.remainingHours}h {this.state.remainingMinutes}m</span>
      </div>
    );
  }
}
