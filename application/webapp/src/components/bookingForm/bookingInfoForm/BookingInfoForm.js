import React, { PureComponent } from "react";
import { v4 as uuidv4 } from "uuid";
import "./BookingInfoForm.css";

export default class BookingInfoForm extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      bookingID: props.bookingID || uuidv4(),
      bookingOrgID: props.bookingOrgID || localStorage.getItem("org") || "N/A",
      transportServiceProviderID: props.transportServiceProviderID || "",
      transportServiceProviderName: props.transportServiceProviderName || "",
      bookingStatus: props.bookingStatus || "N/A",
    };
  }
  getData() {
    return {
      ...this.state,
    };
  }
  render() {
    return (
      <div className="booking-info-form-container">
        <div className="booking-info-form-data">
          <h4>Booking ID: </h4>
          <input
            className="booking-id"
            value={this.state.bookingID}
            disabled
          ></input>
        </div>
        <div className="booking-info-form-data">
          <h4>Booking Organization ID: </h4>
          <input
            className="booking-org-id"
            value={this.state.bookingOrgID}
            disabled
          ></input>
        </div>
        <div className="booking-info-form-data">
          <h4>Transport Service Provider ID: </h4>
          <input
            className="booking-tsp-id"
            value={this.state.transportServiceProviderID}
            onChange={(e) => {
              const val = e.target.value;
              this.setState((prevState) => ({
                ...prevState,
                transportServiceProviderID: val,
              }));
            }}
          ></input>
        </div>
        <div className="booking-info-form-data">
          <h4>Transport Service Provider Name: </h4>
          <input
            className="booking-tsp-id"
            value={this.state.transportServiceProviderName}
            onChange={(e) => {
              const val = e.target.value;
              this.setState((prevState) => ({
                ...prevState,
                transportServiceProviderName: val,
              }));
            }}
          ></input>
        </div>
        <div
          style={{
            margin: "0 100px",
            textAlign: "center",
            position: "absolute",
            right: 0,
          }}
        >
          <h4>STATUS </h4>
          <hr></hr>
          <p
            style={{
              color:
                this.state.bookingStatus === "SUBMITTED"
                  ? "lightseagreen"
                  : "darkgray",
              fontWeight: "bold",
            }}
          >
            {this.state.bookingStatus}
          </p>
        </div>
      </div>
    );
  }
}
