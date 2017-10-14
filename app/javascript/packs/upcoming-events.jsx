import React from 'react'
import restful, { fetchBackend } from 'restful.js';
import _ from 'underscore'
import lscache from 'lscache'
import moment from 'moment'

export default class UpcomingEvents extends React.Component {
  constructor(props) {
    super(props);
    this.cacheKey = 'upcoming-events';
    this.handleIndexResponse = this.handleIndexResponse.bind(this);

    let events= lscache.get(this.cacheKey);
    if (!events) {
      events = []
    }
    this.state = {
      events: events 
    };

    const api = restful(window.location.protocol + '//' + window.location.host, fetchBackend(fetch)); // TODO: hacky
    this.apiCollection = api.all('upcoming_events'); 

    this.fetch();
  }

  fetch() {
    this.apiCollection.getAll().then(this.handleIndexResponse);
  }

  handleIndexResponse(response) {
    let events = _.map(response.body(), (entity) => {
      return entity.data();
    });

    this.setState({
      events: events 
    });

    lscache.set(this.cacheKey, events);
  }

  //resetForm() {
    //this.setState({
      //form: this.emptyFormProps()
    //});
  //}

  render() {
    const events = _.map(this.state.events, (item) => {
      let days = moment(item.date).diff(moment(), 'days');

      return (<li>{item.name} in {days} days</li>); // TODO: handle singular
    });

    return (
      <div>
        <div className="homescreen-header">Upcoming</div>
        <ul className="upcoming-events">{events}</ul>
      </div>
    );
  }
}
