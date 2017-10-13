import React from 'react'
import _ from 'underscore'
import { connect, PromiseState } from 'react-refetch'
import lscache from 'lscache'

class NicehashStats extends React.Component {
  fetchData() {
    const {nicehashFetch} = this.props;
    const cacheKey = 'nicehash-stats';
    const lastHourCacheKey = 'nicehash-stats-last-hour';
    const lastHourField = 'lastHourEarnedMbtc';

    if (nicehashFetch.fulfilled) {
      const data = _.create(nicehashFetch.value);

      lscache.set(cacheKey, _.omit(data, lastHourField), 60 * 6); // 6 hours
      lscache.set(lastHourCacheKey, _.pick(data, lastHourField), 30); // 30 minutes

      return data;
    } else {
      let data = lscache.get(cacheKey);
      const lastHour = lscache.get(lastHourCacheKey);

      data = _.extend(data, lastHour);

      return data;
    }
  }

  render() {
    const data = this.fetchData();

    let fields = [
      {label: 'Last hour', key: 'lastHourEarnedMbtc'},
      {label: 'Last day', key: 'lastDayEarnedMbtc'},
      {label: 'US$1', key: 'mbtcPerUsd'}
    ];

    fields = _.map(fields, (field) => {
      let value = '';
      if (data && data[field.key]) {
        value = data[field.key];
      }

      return (
        <li className="nicehash-stats-field" key={field.key}>
          <div className="nicehash-stats-label">{field.label}</div>
          <div>
            <span className="nicehash-stats-value">{value}</span>
            <span> </span>
            <span className="nicehash-stats-units">μ<i className="fa fa-btc"></i></span>
          </div>
        </li>
      );
    });

    return (
      <div>
        <div className="homescreen-header">Internet Heater Machine</div>
        <ul className="nicehash-stats-list">{fields}</ul>
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
