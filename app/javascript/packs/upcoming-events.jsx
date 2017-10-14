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

  handleDelete(id) {
    this.apiCollection.delete(id).then(this.handleApiResponse);
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
  
  renderEventForm() {
    return (
      <div>
        <div className="upcoming-events-form-heading">new</div>
        <form className="upcoming-events-form" onSubmit={this.handleFormSubmit.bind(this)}>
          <input type="text" placeholder="name" name="name" value={this.state.form.name} onChange={this.handleFormInputChange} />
          <input type="text" placeholder="date" name="date" value={this.state.form.date} onChange={this.handleFormInputChange} />
          <button type="submit"><i className="fa fa-plus" aria-hidden="true"></i></button>
        </form>
      </div>
    );
  }

  renderEvent(event) {
    let countdown = moment(event.date).diff(moment(), 'days') + 1;
    if (countdown == 1) {
      countdown += ' day';
    } else {
      countdown += ' days';
    }

    let deleteButton = null;
    if (this.state.editMode) {
      deleteButton = (<button className="upcoming-event-delete" onClick={() => { this.handleDelete(event.id); }}><i className="fa fa-trash-o" aria-hidden="true"></i></button>);
    }

    // TODO: handle singular
    return (
      <li className="upcoming-event" key={event.id}>
        <div className="upcoming-event-name">{event.name}</div>
        <div className="upcoming-event-countdown">{countdown}</div>
        {deleteButton}
      </li>
    );
  }

  render() {
    let events;
    if (this.state.editMode) {
      events = this.state.events;
    } else {
      events = _.first(this.state.events, 2);
    }
    events = _.map(events, this.renderEvent.bind(this));

    let eventForm = null;
    let editButtonClass = 'homescreen-header-edit-toggle';
    if (this.state.editMode) {
      eventForm = this.renderEventForm();
      editButtonClass += ' active';
    }

    return (
      <div>
        <div className="homescreen-header">
          Upcoming
          <a className={editButtonClass} onClick={this.handleEditToggle.bind(this)} href="javascript:void(0)">edit</a>
        </div>
        <ul className="upcoming-events-list">{events}</ul>
        {eventForm}
      </div>
    );
  }
}
