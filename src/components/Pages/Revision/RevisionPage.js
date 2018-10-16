/* eslint-disable class-methods-use-this */
/* eslint-disable no-invalid-this */

import React from "react";
import PropTypes from "prop-types";
import functions from "../../../utils/HistoryCaseRevision.functions";
import TopBar from "../../TopBar/TopBar";
import RevisionContainer from "./RevisionContainer";
import ResultsContainer from "./ResultsContainer";
import dummyData from "../../../utils/dummy-data.json";

// <Revision> :: manages state across all child components
export default class RevisionPage extends React.Component {
  state = {
    stationName: null,
    time: 0,
    intervalId: null,
    caseTitle: null,
    caseDetails: null,
    tickDisplayed: false,
    caseDetailsDisplayed: true,
    resultsDisplayed: false,
    markSchemeCompleted: 0,
    markSchemeElements: []
  };

  componentDidMount() {
    const { station, caseid } = this.props.match.params;
    const revisionList = dummyData.history[station][caseid]["mark-scheme"].map(
      listElement => ({ text: listElement, completed: false })
    );
    this.setState({
      stationName: station,
      caseTitle: dummyData.history[station][caseid].title,
      caseDetails: dummyData.history[station][caseid].details,
      markSchemeElements: revisionList,
      intervalId: setInterval(this.timerCount, 1000)
    });
  }

  timerCount = () => {
    this.setState(prevState => ({
      time: prevState.time + 1
    }));
  };
  //log marks and progress user to feedback screen
  //todo: how do we link this into database/data store?
  submitCase = () => {
    /*
    * render feedback page passing this.state.markSchemeCompleted as a prop
    */
    clearInterval(this.state.intervalId);
    this.setState({ resultsDisplayed: !this.state.resultsDisplayed });
  };

  //swipe between the case details and the mark scheme
  swipe = () => {
    this.setState(prevState => functions.swipe(prevState));
  };

  //mark indivual mark scheme element as completed
  markComplete = id => {
    this.setState(prevState => functions.markComplete(id, prevState));
  };

  render() {
    const revisionContainer = (
      <RevisionContainer
        id="revision"
        markComplete={this.markComplete}
        swipe={this.swipe}
        caseTitle={this.state.caseTitle}
        caseDetails={this.state.caseDetails}
        caseDetailsDisplayed={this.state.caseDetailsDisplayed}
        markSchemeElements={this.state.markSchemeElements}
        markSchemeCompleted={this.state.markSchemeCompleted}
      />
    );

    const resultsContainer = (
      <ResultsContainer
        markSchemeTotal={this.state.markSchemeElements.length}
        markSchemeCompleted={this.state.markSchemeCompleted}
        markSchemeElements={this.state.markSchemeElements}
      />
    );
    return (
      <React.Fragment>
        <TopBar
          id="topbar"
          stationName={this.state.stationName}
          submitCase={this.submitCase}
          tickDisplayed={this.state.tickDisplayed}
          time={this.state.time}
        />
        {this.state.resultsDisplayed ? resultsContainer : revisionContainer}
      </React.Fragment>
    );
  }
}

RevisionPage.propTypes = {
  match: PropTypes.object
};
