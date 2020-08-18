import React from "react";
import "./BookingInfo.css";

const BookingInfo = (props) => (
  <div className="booking-info-container">
    <div className="booking-info-data">
      <h4>Booking ID: </h4>
      <p>{props.booking.bookingID}</p>
    </div>
    <div className="booking-info-data">
      <h4>Booking Organization ID: </h4>
      <p>{props.booking.bookingOrgID}</p>
    </div>
    <div className="booking-info-data">
      <h4>Transport Service Provider [ ID / Name ]: </h4>
      <p>
        {props.booking.transportServiceProviderID} /{" "}
        {props.booking.transportServiceProviderName}
      </p>
    </div>
    <div
      style={{
        margin: "0 60px",
        textAlign: "center",
        position: "absolute",
        right: 0,
      }}
    >
      <h4>STATUS </h4>
      <p
        style={{
          color:
            props.booking.bookingStatus === "SUBMITTED"
              ? "lightseagreen"
              : props.booking.bookingStatus === "APPROVED"
              ? "green"
              : "red",
          fontWeight: "bold",
        }}
      >
        <hr></hr>
        {props.booking.bookingStatus}
      </p>
    </div>
  </div>
);

export default BookingInfo;
