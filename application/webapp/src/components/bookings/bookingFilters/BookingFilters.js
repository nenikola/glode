import React, { Component } from "react";
import { InputText } from "primereact/inputtext/";
import "./BookingFilters.css";
import { Dropdown } from "primereact/dropdown";

export default class BookingFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingOrgID: "",
      transportServiceProviderID: "",
      bookingStatus: "",
      transferEquipmentType: "",
    };
  }

  render() {
    return (
      <div className="booking-filters">
        <div>Filters:</div>
        <span className="p-float-label">
          <InputText
            className="field"
            id="input-float-bookingOrgID"
            value={this.state.bookingOrgID}
            onChange={(e) => this.setState({ bookingOrgID: e.target.value })}
          />
          <label htmlFor="input-float-bookingOrgID">Booking Org ID</label>
        </span>
        <span className="p-float-label">
          <InputText
            className="field"
            id="input-float-transportServiceProviderID"
            value={this.state.transportServiceProviderID}
            onChange={(e) =>
              this.setState({ transportServiceProviderID: e.target.value })
            }
          />
          <label htmlFor="input-float-transportServiceProviderID">
            Transport Service Provider ID
          </label>
        </span>
        <div className="dropdown-wrapper">
          Status:
          <Dropdown
            value={this.state.bookingStatus}
            options={["SUBMITTED", "APPROVED", "REJECTED", "ALL"]}
            onChange={(e) =>
              this.setState({ bookingStatus: e.value === "ALL" ? "" : e.value })
            }
            placeholder="Select a status"
            itemTemplate={(bookingStatus) => bookingStatus}
          />
        </div>
        <div className="dropdown-wrapper">
          Transfer Equipment Type:
          <Dropdown
            value={this.state.transferEquipmentType}
            options={["20_FEET_CONTAINER", "40_FEET_CONTAINER", "ALL"]}
            onChange={(e) =>
              this.setState({
                transferEquipmentType: e.value === "ALL" ? "" : e.value,
              })
            }
            placeholder="Select a TE type"
            itemTemplate={(transferEquipmentType) => transferEquipmentType}
          />
        </div>

        <div className="button-wrapper">
          <button
            onClick={(e) => {
              this.props.onQuery(this.state);
            }}
          >
            search
          </button>
        </div>
      </div>
    );
  }
}
