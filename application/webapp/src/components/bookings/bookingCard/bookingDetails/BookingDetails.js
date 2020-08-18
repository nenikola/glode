import React from "react";
import { ReactComponent as ContPic } from "./container.svg";
import { ReactComponent as CalendarPic } from "./calendar.svg";
import { ReactComponent as VesselPic } from "./vessel.svg";
import "./BookingDetails.css";
import BookingOptions from "../bookingOptions/BookingOptions";
const BookingDetails = (props) => (
  <div
    className={
      !props.active
        ? "booking-details-wrapper"
        : "booking-details-wrapper active"
    }
  >
    <hr style={{ width: "100%", color: "lightgray" }}></hr>
    <h3 style={{ marginLeft: "10px" }}>Details:</h3>
    <div className="booking-details">
      <div>
        <p>Transfer Equipment: </p>
        <hr></hr>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ContPic style={{ width: 70, height: 80, margin: 10 }}></ContPic>
          <div>
            <p style={{ marginTop: 15 }}>Type:</p>
            <p style={{ color: "lightseagreen", fontWeight: "bold" }}>
              {props.booking.equipmentData.transferEquipmentType}
            </p>
            <p style={{ marginTop: 15 }}>Quantity:</p>
            <p style={{ color: "lightseagreen", fontWeight: "bold" }}>
              {props.booking.equipmentData.transferEquipmentQuantity}
            </p>
          </div>
        </div>
      </div>
      <div>
        <p>Requested Departure: </p>
        <hr></hr>
        <div
          style={{
            display: "flex",
            alignItems: "top",
          }}
        >
          <VesselPic style={{ width: 60, height: 60, margin: 10 }}></VesselPic>
          <div>
            <p style={{ marginTop: 15 }}>Date:</p>
            <p style={{ color: "lightseagreen", fontWeight: "bold" }}>
              {props.booking.transferData.requestedDeparture}
            </p>
          </div>
        </div>
      </div>
      <div>
        <p>RequestedArrival: </p>
        <hr></hr>
        <div
          style={{
            display: "flex",
            alignItems: "top",
          }}
        >
          <CalendarPic
            style={{ width: 50, height: 50, margin: 10 }}
          ></CalendarPic>
          <div>
            <p style={{ marginTop: 15 }}>Date:</p>
            <p style={{ color: "lightseagreen", fontWeight: "bold" }}>
              {!props.booking.transferData.requestedArrival
                ? "N / A"
                : props.booking.transferData.requestedArrival}
            </p>
          </div>
        </div>
      </div>
    </div>
    <BookingOptions
      active={props.active}
      booking={props.booking}
    ></BookingOptions>
  </div>
);

export default BookingDetails;
