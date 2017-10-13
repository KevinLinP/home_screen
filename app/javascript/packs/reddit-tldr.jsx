import React from 'react'
import { connect, PromiseState } from 'react-refetch'
import _ from 'underscore'
import moment from 'moment'

class RedditTldr extends React.Component {
  render() {
    const {redditTldrFetch} = this.props;

    if (!redditTldrFetch.fulfilled) {
      return null;
    }

    const data = redditTldrFetch.value;

    const day = moment(data.date).format('dddd');

    let items = data.title.split(/;\s?/);
    items = _.map(items, (item, index) => {
      return (<li key={index}>{item}</li>);
    });

    return (
      <div>
        <div className="reddit-tldr-heading">Reddit tl;dr</div>
        <a className="reddit-tldr-link" href={data.url} target="_blank">
          <div>
            <span className="reddit-tldr-date">{day}</span>
            <i className="fa fa-external-link" aria-hidden="true"></i>
          </div>
          <ul className="reddit-tldr-list">{items}</ul>
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
