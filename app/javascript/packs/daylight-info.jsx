import React from 'react'
import restful, { fetchBackend } from 'restful.js';
import lscache from 'lscache'
import _ from 'underscore'
import moment from 'moment'

export default class DaylightInfo extends React.Component {
  constructor(props) {
    super(props);
    this.cacheKey = 'daylight-info';
    this.refresh = this.refresh.bind(this);
    this.recalculateCurrentEvent = this.recalculateCurrentEvent.bind(this);

    this.state = {
      events: lscache.get(this.cacheKey)
    }

    this.fetchApi();
  }

  componentDidMount() {
    this.timerIntervalId = window.setInterval(this.refresh, 5000);
    this.refresh();
  }

  componentWillUnmount() {
    window.clearInterval(this.timerIntervalId);
  }

  recalculateCurrentEvent() {
    if (!this.state.events) {
      return;
    }

    const now = moment();
    const currentEvent = _.find(this.state.events, (event) => {
      return moment(event.timestamp).isAfter(now);
    });

    this.setState({
      currentEvent: currentEvent
    }, this.refresh);
  }

  // TODO: simplify
  refresh() {
    if (!this.state.events) {
      return;
    }

    const currentEvent = this.state.currentEvent;
    if (!this.state.currentEvent) {
      this.recalculateCurrentEvent();
      return;
    }

    const now = moment();
    const futureTime = moment(currentEvent.timestamp);

    if (now.isAfter(futureTime)) {
      this.recalculateCurrentEvent();
      return;
    }

    const hours = futureTime.diff(now, 'hours');
    const minutes = (futureTime.diff(now, 'minutes') % 60);

    this.setState({
      remainingTime: `${hours}h ${minutes}m`
    });
  }

  fetchApi() {
    const api = restful(window.location.protocol + '//' + window.location.host, fetchBackend(fetch)); // TODO: hacky
    api.all('daylight_info').getAll().then((response) => {
      const events = _.map(response.body(), (entity) => { // blehhhh
        return entity.data();
      });

      this.setState({ events: events }, this.recalculateCurrentEvent);

      lscache.set(this.cacheKey, events, 60 * 60 * 24 * 3); // 3 days
    });
  }

  render() {
    if (this.state.remainingTime) {
      const type = this.state.currentEvent.type;
      return (
        <div className="daylight-event">
          <span className={'daylight-event-' + type}>{type}</span>
          <span> in </span>
          <span className="daylight-event-time">{this.state.remainingTime}</span>
        </div>
      )
    } else {
      return null;
    }
  }
}
