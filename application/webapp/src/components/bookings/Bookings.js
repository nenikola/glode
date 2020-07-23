import React, { Component } from "react";
import "./Bookings.css";
export default class Bookings extends Component {
  render() {
    return (
      <div className="bookings-container">
        <div className="bookings-toolbar">
          <a>create new</a>
        </div>
        <div>
          <p>Found bookings:</p>
        </div>
      </div>
    );
  }
}
