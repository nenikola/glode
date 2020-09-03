import React, { Component } from "react";
import Navbar from "./../../components/navbar/Navbar";
import "./Dashboard.css";
import { Switch, Route } from "react-router-dom/cjs/react-router-dom.min";
import Bookings from "../../components/bookings/Bookings";
import { Redirect } from "react-router-dom";
import BookingForm from "../../components/bookingForm/BookingForm";
import Transfers from "../../components/transfers/Transfers";
import TransferDetails from "../../components/transfers/transferDetails/TransferDetails";
import Login from "../login/Login";
import EquipmentForm from "../../components/transferEquipment/equipmentForm/EquipmentForm";
class Dashboard extends Component {
  render() {
    if (!localStorage.getItem("auth")) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="dashboard-container">
        <div className="dashboard-filter"></div>
        <div className="dashboard-logo">
          <h1 className="unselectable">
            <p style={{ display: "inline", color: "#47b6b1" }}>G</p>LODE
          </h1>
        </div>
        <div className="dashboard-main">
          <div className="dashboard-navbar">
            <Navbar width="100%" height="100%"></Navbar>
          </div>
          <div className="dashboard-data">
            <Switch>
              <Route path="/createBooking">
                <BookingForm></BookingForm>
              </Route>
              <Route path="/bookings/:id">BookingID</Route>
              <Route path="/bookings">
                <Bookings></Bookings>
              </Route>
              <Route path="/transfers/:id" component={TransferDetails}></Route>
              <Route path="/transfers">
                <Transfers></Transfers>
              </Route>
              <Route path="/transfers">
                <Transfers></Transfers>
              </Route>
              <Route path="/equipment">
                <EquipmentForm></EquipmentForm>
              </Route>
              <Route exact path="/">
                {localStorage.getItem("org") ? (
                  <Redirect to="/bookings" />
                ) : (
                  <Login />
                )}
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
