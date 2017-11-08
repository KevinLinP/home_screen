import React from 'react'
import restful, { fetchBackend } from 'restful.js';
import lscache from 'lscache'
import _ from 'underscore'
import moment from 'moment'

export default class DaylightInfo extends React.Component {
  constructor(props) {
    super(props);

    this.cacheKey = 'daylight-info';

    this.state = {
      events: lscache.get(this.cacheKey)
    };

    this.fetchApi();
  }

  componentDidMount() {
    if (this.state.events) {
      this.init();
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.timerIntervalId);
  }

  init() {
    this.timerIntervalId = window.setInterval(this.refresh.bind(this), 5000);
    this.refresh();
  }

  fetchApi() {
    const api = restful(window.location.protocol + '//' + window.location.host, fetchBackend(fetch)); // TODO: hacky
    api.all('daylight_info').getAll().then((response) => {
      const events = _.map(response.body(), (entity) => {
        return entity.data();
      });

      lscache.set(this.cacheKey, events, 60 * 60 * 24 * 3); // 3 days

      const prevStateEvents = this.state.events;
      this.setState({ events: events }, () => {
        if (!prevStateEvents) {
          this.init();
        }
      });
    });
  }

  findCurrentEvent() {
    const now = moment();

    return _.find(this.state.events, (event) => {
      return moment(event.timestamp).isAfter(now);
    });
  }

  refresh() {
    const now = moment();
    const newState = {};

    let currentEvent = this.state.currentEvent;

    if (!currentEvent || now.isAfter(moment(currentEvent.timestamp))) {
      currentEvent = this.findCurrentEvent();
      newState.currentEvent = currentEvent;
    }

    const futureTime = moment(currentEvent.timestamp);
    const hours = futureTime.diff(now, 'hours');
    const minutes = (futureTime.diff(now, 'minutes') % 60);
    newState.remainingTime = `${hours}h ${minutes}m`;

    this.setState(newState);
  }

  render() {
    if (this.state.currentEvent) {
      const type = this.state.currentEvent.type;
      return (
        <div className="daylight-event">
          <span className={'daylight-event-' + type}>{type}</span>
          <span> in </span>
          <span className="daylight-event-time">{this.state.remainingTime}</span>
        </div>
      );
    } else {
      return null;
    }
  }
}
