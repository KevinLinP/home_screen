import React from 'react'
import ReactDOM from 'react-dom'

import moment from 'moment'

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: this.display()
    };
  }

  componentDidMount() {
    const updateState = () => {
      this.setState({
        display: this.display()
      });
    };

    this.timerIntervalId = window.setInterval(updateState, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timerIntervalId);
  }

  display() {
    return moment().format('H:mm');
  }

  render() {
    return (
      <div className="clock">{this.state.display}</div>
    );
  }
}
