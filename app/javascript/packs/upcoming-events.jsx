import React from 'react'
import restful, { fetchBackend } from 'restful.js';
import _ from 'underscore'
import lscache from 'lscache'
import moment from 'moment'

export default class UpcomingEvents extends React.Component {
  constructor(props) {
    super(props);
    this.cacheKey = 'upcoming-events';
    this.handleApiResponse = this.handleApiResponse.bind(this);
    this.handleEditToggle = this.handleEditToggle.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormInputChange = this.handleFormInputChange.bind(this);

    let events = lscache.get(this.cacheKey);
    if (!events) {
      events = []
    }
    this.state = {
      events: events,
      editMode: false,
      form: this.emptyFormProps()
    };

    const api = restful(window.location.protocol + '//' + window.location.host, fetchBackend(fetch)); // TODO: hacky
    this.apiCollection = api.all('upcoming_events'); 

    this.fetch();
  }

  fetch() {
    this.apiCollection.getAll().then(this.handleApiResponse);
  }

  handleApiResponse(response) {
    let events = _.map(response.body(), (entity) => {
      return entity.data();
    });

    events = _.sortBy(events, 'date');

    this.setState({events: events});
    lscache.set(this.cacheKey, events);
  }

  handleEditToggle() {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  handleFormSubmit(event) {
    event.preventDefault();

    let resetForm = () => {
      this.setState({form: this.emptyFormProps()});
    };

    this.apiCollection.post(this.state.form).then(this.handleApiResponse).then(resetForm);
  }

  handleFormInputChange(e) {
    const changed = {[e.target.name]: e.target.value};

    this.setState({
      form: Object.assign({}, this.state.form, changed)
    });
  }

  emptyFormProps() {
    return {
      name: '',
      date: ''
    };
  }
  
  eventForm() {
    return (
      <form className="upcoming-events-form" onSubmit={this.handleFormSubmit}>
        <input type="text" placeholder="name" name="name" value={this.state.form.name} onChange={this.handleFormInputChange} />
        <input type="text" placeholder="date" name="date" value={this.state.form.date} onChange={this.handleFormInputChange} />
        <button type="submit"><i className="fa fa-plus" aria-hidden="true"></i></button>
      </form>
    );
  }

  render() {
    const events = _.map(this.state.events, (event) => {
      let days = moment(event.date).diff(moment(), 'days');

      return (<li key={event.id}>{event.name} in {days} days</li>); // TODO: handle singular
    });

    let eventForm = null;
    let editButtonClass = 'homescreen-header-edit-toggle';
    if (this.state.editMode) {
      eventForm = this.eventForm();
      editButtonClass += ' active';
    }

    return (
      <div>
        <div className="homescreen-header">
          Upcoming
          <a className={editButtonClass} onClick={this.handleEditToggle} href="javascript:void(0)">edit</a>
        </div>
        <ul className="upcoming-events-list">{events}</ul>
        {eventForm}
      </div>
    );
  }
}
