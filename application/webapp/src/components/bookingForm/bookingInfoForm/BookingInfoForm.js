import React, { PureComponent } from "react";
import { v4 as uuidv4 } from "uuid";
import "./BookingInfoForm.css";
import { ExistingOrganizations } from "app-shared-library";
import { Dropdown } from "primereact/dropdown";
export default class BookingInfoForm extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      bookingID: props.bookingID || uuidv4(),
      bookingOrg:
        props.bookingOrg || {
          organizationID: localStorage.getItem("org"),
          organizationName: localStorage.getItem("orgName"),
        } ||
        "N/A",
      transportServiceProvider: props.transportServiceProvider || "",
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
          <h4>Booking Organization: </h4>
          <input
            className="booking-org-id"
            value={this.state.bookingOrg.organizationName}
            disabled
          ></input>
        </div>
        <div className="booking-info-form-data">
          <h4>Transport Service Provider: </h4>
          <div className="dropdown-wrapper">
            <Dropdown
              showClear={true}
              className="dropdown"
              value={this.state.transportServiceProvider}
              optionLabel={"organizationName"}
              options={[
                ExistingOrganizations.OCA,
                ExistingOrganizations.OCB,
                ExistingOrganizations.ITA,
                ExistingOrganizations.ITB,
                ExistingOrganizations.FFA,
              ]}
              onChange={(e) => {
                console.log(e.value);
                this.setState({
                  transportServiceProvider: e.value,
                });
              }}
              placeholder="Select a TSP"
            />
          </div>
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
