import React, { Component } from "react";
import { InputText } from "primereact/inputtext/";
import "./BookingFilters.css";
import { Dropdown } from "primereact/dropdown";

export default class BookingFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingOrgID: "",
      tspID: "",
      status: { status: "ALL" },
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
            id="input-float-tspID"
            value={this.state.tspID}
            onChange={(e) => this.setState({ tspID: e.target.value })}
          />
          <label htmlFor="input-float-tspID">
            Transport Service Provider ID
          </label>
        </span>
        <div className="dropdown-wrapper">
          Status:
          <Dropdown
            optionLabel="status"
            value={this.state.status}
            options={[
              { status: "SUBMITTED" },
              { status: "APPROVED" },
              { status: "REJECTED" },
              { status: "ALL" },
            ]}
            onChange={(e) => this.setState({ status: e.value })}
            placeholder="Select a status"
            itemTemplate={(status) => status.status}
          />
        </div>
        <div className="dropdown-wrapper">
          Transfer Equipment Type:
          <Dropdown
            optionLabel="transferEquipmentType"
            value={this.state.status}
            options={[
              { transferEquipmentType: "20_FEET_CONTAINER" },
              { transferEquipmentType: "40_FEET_CONTAINER" },
            ]}
            onChange={(e) => this.setState({ transferEquipmentType: e.value })}
            placeholder="Select a TE type"
            itemTemplate={(transferEquipmentType) =>
              transferEquipmentType.transferEquipmentType
            }
          />
        </div>

        <div className="button-wrapper">
          <button>search</button>
        </div>
      </div>
    );
  }
}
