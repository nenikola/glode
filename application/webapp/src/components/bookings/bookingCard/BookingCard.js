import React, { Component } from "react";
import "./BookingCard.css";

import LocationsPanel from "./locationsPanel/LocationsPanel";
import BookingInfo from "./bookingInfo/BookingInfo";
import BookingDetails from "./bookingDetails/BookingDetails";
import BookingOptions from "./bookingOptions/BookingOptions";

class BookingCard extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }
  render() {
    return (
      <div
        className={this.state.active ? "booking active" : "booking"}
        onClick={(e) => {
          console.log(e.target);
          this.setState((state) => ({ active: !state.active }));
        }}
      >
        <BookingInfo booking={this.props.booking}></BookingInfo>
        <hr style={{ width: "100%", color: "lightgray" }}></hr>
        <LocationsPanel
          active={this.state.active}
          booking={this.props.booking}
        ></LocationsPanel>
        <BookingDetails
          active={this.state.active}
          booking={this.props.booking}
        ></BookingDetails>
        <div className="expand-arrow">
          {this.state.active ? <p>&#9650;</p> : <p> &#9660;</p>}
        </div>
      </div>
    );
  }
}
export default BookingCard;
