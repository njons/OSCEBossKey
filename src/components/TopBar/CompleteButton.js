/* eslint-disable class-methods-use-this */

import React from "react";
import PropTypes from "prop-types";
import tickIcon from "../../assets/icons/tick_white.svg";
import { Link } from "react-router-dom";

export default class CompleteButton extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.exam && `<Link to=${this.props.exam}>`}
        <button
          id="complete"
          data-testid="complete"
          onClick={() => this.props.submitCase()}
          className={
            this.props.tickDisplayed ? `tick--displayed` : `tick--not-displayed`
          }
        >
          <img src={tickIcon} />
        </button>
        {this.props.exam && `</Link>`}
      </React.Fragment>
    );
  }
}

CompleteButton.propTypes = {
  exam: PropTypes.string,
  submitCase: PropTypes.func,
  tickDisplayed: PropTypes.bool
};
