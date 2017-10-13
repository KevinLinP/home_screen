import React from 'react'
import { connect, PromiseState } from 'react-refetch'
import _ from 'underscore'
import moment from 'moment'
import lscache from 'lscache'

// TODO: add 'mark as read' hiding

// thought about putting refresh interval as a 'class constant'
class RedditTldr extends React.Component {
  fetchData() {
    const {redditTldrFetch} = this.props;
    const cacheKey = 'reddit-tldr';

    if (redditTldrFetch.fulfilled) {
      const data = redditTldrFetch.value;
      lscache.set(cacheKey, data, 60 * 6); // 6 hours

      return data;
    } else {
      return lscache.get(cacheKey);
    }
  }

  transformData(data) {
    data = Object.assign({}, data);

    data.day = moment(data.date).format('dddd');

    data.items = data.title.split(/;\s?/);
    data.items = _.map(data.items, (item, index) => {
      return (<li key={index}>{item}</li>);
    });

    return data;
  }

  render() {
    let data = this.fetchData();
    if (!data) {
      return null;
    }

    data = this.transformData(data);

    return (
      <div>
        <div className="homescreen-header">Reddit tl;dr</div>
        <a className="reddit-tldr-link" href={data.url} target="_blank">
          <div>
            <span className="reddit-tldr-date">{data.day}</span>
            <i className="fa fa-external-link" aria-hidden="true"></i>
          </div>
          <ul className="reddit-tldr-list">{data.items}</ul>
        </a>
      </div>
    );
  }
}

export default connect(props => ({
  redditTldrFetch: {
    url: '/reddit',
    refreshInterval: (1000 * 60 * 15) // 15 minutes
  }
}))(RedditTldr)
