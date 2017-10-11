import React from 'react'
import { connect, PromiseState } from 'react-refetch'

class NicehashStats extends React.Component {
  render() {
    const {nicehashFetch} = this.props;

    if (!nicehashFetch.fulfilled) {
      return null;
    }

    const data = nicehashFetch.value;

    // tried iterating through array. React needs array items components wrapped in a tag, Bootstrap's dl doesn't like that
    return (
      <div>
        <div className="nicehash-stats-heading">Internet Heater Machine</div>
        <dl className="nicehash-stats-list">
          <dt>Last hour</dt>
          <dd><span className="nicehash-stats-value">{data.lastHourEarnedMbtc}</span> <span className="nicehash-stats-units">μ<i className="fa fa-btc"></i></span></dd>

          <dt>Last Day</dt>
          <dd><span className="nicehash-stats-value">{data.lastDayEarnedMbtc}</span> <span className="nicehash-stats-units">μ<i className="fa fa-btc"></i></span></dd>

          <dt>US$1</dt>
          <dd><span className="nicehash-stats-value">{data.mbtcPerUsd}</span> <span className="nicehash-stats-units">μ<i className="fa fa-btc"></i></span></dd>
        </dl>
      </div>
    )
  }
}

export default connect(props => ({
  nicehashFetch: {
    url: '/nicehash',
    refreshInterval: (1000 * 60 * 3) // 3 minutes
  }
}))(NicehashStats)
