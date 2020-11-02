import React, { Component } from "react";
// import { InputText } from "primereact/inputtext/";
import "./TransferFilters.css";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { ExistingOrganizations } from "app-shared-library";

export default class TransferFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transportServiceProvider: "",
      departureBefore: "",
      arrivalBefore: "",
    };
  }

  render() {
    console.log(JSON.stringify(this.state.transportServiceProvider));
    return (
      <div className="transfer-filters">
        <div>Filters:</div>
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
        <div className="calendar-wrapper">
          <div>Departure before:</div>
          <Calendar
            showIcon={true}
            value={this.state.departureBefore}
            onChange={(e) => this.setState({ departureBefore: e.value })}
          ></Calendar>
        </div>
        <div className="calendar-wrapper">
          <div>Arrival before:</div>
          <Calendar
            showIcon={true}
            value={this.state.arrivalBefore}
            onChange={(e) => this.setState({ arrivalBefore: e.value })}
          ></Calendar>
        </div>

        <div className="button-wrapper">
          <button
            onClick={(e) => {
              this.props.onQuery({
                transportServiceProviderID: this.state.transportServiceProvider
                  ? this.state.transportServiceProvider.organizationID
                  : "",
                departureBefore: this.state.departureBefore,
                arrivalBefore: this.state.arrivalBefore,
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
