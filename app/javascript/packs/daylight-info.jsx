import React from 'react'
import restful, { fetchBackend } from 'restful.js';
import lscache from 'lscache'
import _ from 'underscore'
import moment from 'moment'

export default class DaylightInfo extends React.Component {
  constructor(props) {
    super(props);
    this.cacheKey = 'daylight-info';
    this.eventsLoaded = this.eventsLoaded.bind(this);
    this.recalculateCurrentEvent = this.recalculateCurrentEvent.bind(this);
    this.refresh = this.refresh.bind(this);

    this.state = {
      events: lscache.get(this.cacheKey)
    }

    this.fetchApi();
  }

  componentDidMount() {
    if (this.state.events) {
      this.eventsLoaded();
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.timerIntervalId);
  }

  eventsLoaded() {
    this.timerIntervalId = window.setInterval(this.refresh, 5000);
    this.recalculateCurrentEvent();
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
          this.eventsLoaded();
        }
      });
    });
  }

  recalculateCurrentEvent() {
    const now = moment();
    const currentEvent = _.find(this.state.events, (event) => {
      return moment(event.timestamp).isAfter(now);
    });

    this.setState({
      currentEvent: currentEvent
    }, this.refresh);
  }

  refresh() {
    const currentEvent = this.state.currentEvent;

    const now = moment();
    const futureTime = moment(currentEvent.timestamp);

    if (now.isAfter(futureTime)) {
      this.recalculateCurrentEvent();
    } else {
      const hours = futureTime.diff(now, 'hours');
      const minutes = (futureTime.diff(now, 'minutes') % 60);

      this.setState({
        remainingTime: `${hours}h ${minutes}m`
      });
    }
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
      )
    } else {
      return null;
    }
  }
}
