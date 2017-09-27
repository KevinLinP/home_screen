import React from 'react'

import moment from 'moment'

export default class Weather extends React.Component {
  constructor() {
    super();
    this.state = {
      refreshedAt: moment().valueOf(), // store a moment object here if you want a really bad time
      refreshedAtAgo: this.minutesAgoString(0)
    };
  }

  componentDidMount() {
    this.timerIntervalId = window.setInterval(this.update.bind(this), 15000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timerIntervalId);
  }

  url() {
    return "//forecast.io/embed/#lat=47.639469&lon=-122.325989&name=Seattle&units=uk";
  }

  refreshedAt() {
    return moment(this.state.refreshedAt);
  }

  update() {
    if (moment().isAfter(this.refreshedAt().add(5, 'minutes'))) {
      document.getElementById("forecast_embed").src = '';
      document.getElementById("forecast_embed").src = this.url();

      this.setState({
        refreshedAt: moment().valueOf()
      });
    }

    const minutesAgo = moment().diff(this.refreshedAt(), 'minutes');

    this.setState({
      refreshedAtAgo: this.minutesAgoString(minutesAgo)
    });
  }

  minutesAgoString(minutesAgo) {
    if (minutesAgo == 1) {
      return '1 minute';
    } else {
      return minutesAgo + ' minutes';
    }
  }

  render() {
    return (
      <div className="weather">
        <iframe id="forecast_embed" frameBorder="0" height="245" width="100%" src={this.url()}></iframe>
        <div className="weather-refreshed-ago">refreshed {this.state.refreshedAtAgo} ago</div>
      </div>
    )
  }

}
