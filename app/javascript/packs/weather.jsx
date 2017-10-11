import React from 'react'

import moment from 'moment'

export default class Weather extends React.Component {
  constructor() {
    super();
    this.state = {
      refreshedAt: moment().valueOf(), // store a moment object here if you want a really bad time
    };
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.timerIntervalId = window.setInterval(this.update, 15000);
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
      window.setTimeout(() => {
        document.getElementById("forecast_embed").src = this.url();
      }, 1000);

      this.setState({
        refreshedAt: moment().valueOf()
      });
    }
  }

  render() {
    return (
      <div className="weather">
        <iframe id="forecast_embed" frameBorder="0" height="245" width="100%" src={this.url()}></iframe>
      </div>
    )
  }

}
