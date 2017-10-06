import React from 'react'

export default class NicehashStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastHourEarnedMbtc: this.props.initialStats['last_hour_earned_mbtc'],
      lastDayEarnedMbtc: this.props.initialStats['last_day_earned_mbtc'],
      mbtcPerUsd: this.props.initialStats['mbtc_per_usd']
    };
  }

  //componentDidMount() {
    //const updateState = () => {
      //this.setState({
        //display: this.display()
      //});
    //};

    //this.timerIntervalId = window.setInterval(updateState, 1000);
  //}

  //componentWillUnmount() {
    //window.clearInterval(this.timerIntervalId);
  //}

  //display() {
    //return moment().format('H:mm');
  //}

  render() {
    // tried iterating through array. React needs array items components wrapped in a tag, Bootstrap's dl doesn't like that
    return (
      <div>
        <div className="nicehash-stats-heading">Internet Heater Machine</div>
        <dl className="nicehash-stats-list">
          <dt>Last hour</dt>
          <dd><span className="nicehash-stats-value">{this.state.lastHourEarnedMbtc}</span> <span className="nicehash-stats-units">μ<i className="fa fa-btc"></i></span></dd>

          <dt>Last Day</dt>
          <dd><span className="nicehash-stats-value">{this.state.lastDayEarnedMbtc}</span> <span className="nicehash-stats-units">μ<i className="fa fa-btc"></i></span></dd>

          <dt>US$1</dt>
          <dd><span className="nicehash-stats-value">{this.state.mbtcPerUsd}</span> <span className="nicehash-stats-units">μ<i className="fa fa-btc"></i></span></dd>
        </dl>
      </div>
    )
  }
}
