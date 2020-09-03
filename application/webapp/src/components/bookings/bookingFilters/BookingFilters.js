import React, { Component } from "react";
import { InputText } from "primereact/inputtext/";
import "./BookingFilters.css";
import { Dropdown } from "primereact/dropdown";
import {
  ExistingOrganizations,
  BookingStatuses,
  BookingStatusNames,
  TransferEquipmentTypes,
} from "app-shared-library";

export default class BookingFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingOrg: "",
      transportServiceProvider: "",
      bookingStatus: "",
      transferEquipmentType: "",
    };
  }

  render() {
    return (
      <div className="booking-filters">
        <div>Filters:</div>
        <div className="dropdown-wrapper">
          <div>Booking Organization:</div>
          <Dropdown
            showClear={true}
            value={this.state.bookingOrg}
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
                bookingOrg: e.value,
              });
            }}
            placeholder="Select a TSP"
          />
        </div>
        <div className="dropdown-wrapper">
          <div>Transport Service Provider:</div>
          <Dropdown
            showClear={true}
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
        <div className="dropdown-wrapper">
          Status:
          <Dropdown
            showClear={true}
            value={this.state.bookingStatus}
            optionLabel={"bookingStatusName"}
            options={[
              {
                bookingStatusID: 0,
                bookingStatusName: BookingStatusNames.SUBMITTED,
              },
              {
                bookingStatusID: 1,
                bookingStatusName: BookingStatusNames.APPROVED,
              },
              {
                bookingStatusID: 2,
                bookingStatusName: BookingStatusNames.REJECTED,
              },
            ]}
            onChange={(e) =>
              this.setState({
                bookingStatus: e.value,
              })
            }
            placeholder="Select a status"
            itemTemplate={(bookingStatus) => bookingStatus.bookingStatusName}
          />
        </div>
        <div className="dropdown-wrapper">
          Transfer Equipment Type:
          <Dropdown
            showClear={true}
            value={this.state.transferEquipmentType}
            optionLabel={"teTypeName"}
            options={[
              TransferEquipmentTypes.TWNYFTCONTAINER,
              TransferEquipmentTypes.FRTYFTCONTAINER,
            ]}
            onChange={(e) =>
              this.setState({
                transferEquipmentType: e.value,
              })
            }
            placeholder="Select a TE type"
            itemTemplate={(transferEquipmentType) =>
              transferEquipmentType.teTypeName
            }
          />
        </div>

        <div className="button-wrapper">
          <button
            onClick={(e) => {
              this.props.onQuery({
                bookingOrgID: this.state.bookingOrg
                  ? this.state.bookingOrg.organizationID
                  : "",
                transportServiceProviderID: this.state.transportServiceProvider
                  ? this.state.transportServiceProvider.organizationID
                  : "",
                transferEquipmentType: this.state.transferEquipmentType
                  ? this.state.transferEquipmentType.teTypeName
                  : "",
                bookingStatus: this.state.bookingStatus
                  ? this.state.bookingStatus.bookingStatusName
                  : "",
              });
            }}
          >
            search
          </button>
        </div>
      </div>
    );
  }
}
