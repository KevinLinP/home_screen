import React from 'react'
import _ from 'underscore'
import moment from 'moment'
import lscache from 'lscache'
import restful, { fetchBackend } from 'restful.js'

export default class RedditTldr extends React.Component {
  constructor(props) {
    super(props);
    this.cacheKey = 'reddit-tldr';
    this.fetchData = this.fetchData.bind(this);
    this.handleMarkAsRead = this.handleMarkAsRead.bind(this);
    this.handleResponse = this.handleResponse.bind(this);

    let data = lscache.get(this.cacheKey);
    if (data) {
      this.state = data;
    } else {
      this.state = {};
    }

    const api = restful(window.location.protocol + '//' + window.location.host, fetchBackend(fetch)); // TODO: hacky
    this.apiMember = api.custom('reddit');

    this.fetchData();
  }

  componentDidMount() {
    this.timerIntervalId = window.setInterval(this.fetchData, 1000 * 60 * 15);
  }

  componentWillUnmount() {
    window.clearInterval(this.timerIntervalId);
  }

  fetchData() {
    this.apiMember.get().then(this.handleResponse);
  }

  handleMarkAsRead(date) {
    this.apiMember.patch({lastRead: this.state.date}).then(this.handleResponse);
  }

  handleResponse(response) {
    let data = response.body().data();

    data.read = (data.date == data.lastRead);
    data.day = moment(data.date).format('dddd');
    data.items = data.title.split(/;\s?/);

    this.setState(data);
    lscache.set(this.cacheKey, data, 60 * 24);
  }

  render() {
    if (!this.state.url || this.state.read) {
      return null;
    }

    const items = _.map(this.state.items, (item, index) => {
      return (<li key={index}>{item}</li>);
    });

    return (
      <div>
        <div className="homescreen-header">
          Reddit tl;dr
          <a className="reddit-tldr-mark-as-read" href="javascript:void(0);" onClick={this.handleMarkAsRead}>
            <i className="fa fa-check" aria-hidden="true"></i>
          </a>
        </div>
      
        <a className="reddit-tldr-link" href={this.state.url} target="_blank">
          <div>
            <span className="reddit-tldr-date">{this.state.day}</span>
            <i className="fa fa-external-link" aria-hidden="true"></i>
          </div>
          <ul className="reddit-tldr-list">{items}</ul>
        </a>
      </div>
    );
  }
}
