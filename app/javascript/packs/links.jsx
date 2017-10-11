import React from 'react'
import { connect, PromiseState } from 'react-refetch'

import _ from 'underscore'

class Links extends React.Component {
  render() {
    const { linksFetch } = this.props;

    if (!linksFetch.fulfilled) {
      return null;
    }

    let links = linksFetch.value;
    links = _.sortBy(links, 'position');
    links = _.map(links, (link) => {
      return (
        <a className="link" key={link.id} href={link.url}>
          <img className="link-image" src={link.image} />
          <div className="link-name">{link.name}</div>
        </a>
      );
    });

    return (
      <div>
        <div className="links-heading">Favorites</div>
        <div className="links">{links}</div>
      </div>
    );
  }
}

export default connect(props => ({
  linksFetch: {
    url: '/links'
  }
}))(Links)
