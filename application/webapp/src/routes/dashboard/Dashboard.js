import React, { Component } from "react";
import Navbar from "./../../components/navbar/Navbar";
import "./Dashboard.css";
import { Switch, Route } from "react-router-dom/cjs/react-router-dom.min";
import Bookings from "../../components/bookings/Bookings";
class Dashboard extends Component {
  state = {};
  render() {
    return (
      <div className="dashboard-container">
        <div className="dashboard-filter"></div>
        <div className="dashboard-logo">
          <h1 className="unselectable">
            <p style={{ display: "inline", color: "#47b6b1" }}>G</p>LODE
          </h1>
        </div>
        <div className="dashboard-navbar">
          <Navbar width="100%" height="95vh"></Navbar>
        </div>
        <div className="dashboard-data">
          <Switch>
            <Route path="/bookings">
              {" "}
              <Bookings></Bookings>
            </Route>
            <Route path="/transfers"> TRANSFERS</Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default Dashboard;
