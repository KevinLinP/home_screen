import React from 'react'

import moment from 'moment'

export default class Weather extends React.Component {
  constructor() {
    super();
    this.state = {
      refreshedAt: moment().valueOf(), // store a moment object here if you want a really bad time
      showRefreshedAtAgo: false
    };
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.timerIntervalId = window.setInterval(this.update, 1000 * 15);
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
    if (moment().isAfter(this.refreshedAt().add(3, 'minutes'))) {
      document.getElementById("forecast_embed").src = '';
      window.setTimeout(() => {
        document.getElementById("forecast_embed").src = this.url();
      }, 1000);

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
    let refreshedAgo = null;
    if (this.state.showRefreshedAtAgo) {
      refreshedAgo = (<div className="weather-refreshed-ago">refreshed {this.state.refreshedAtAgo} ago</div>);
    }
    
    return (
      <div className="weather">
        <iframe id="forecast_embed" frameBorder="0" height="245" width="100%" src={this.url()}></iframe>
        {refreshedAgo}
      </div>
    )
  }

}
