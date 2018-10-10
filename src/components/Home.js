import React from "react";
import { Link } from "react-router-dom";

export default class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Potential login page</h1>
        <Link to="/history">Log in here</Link>
      </React.Fragment>
    );
  }
}
