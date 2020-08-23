import React, { Component } from "react";
import "./TransferDetails.css";
import Locations from "./locations/Locations";
import TransferData from "./transferData/TransferData";

export default class TransferDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transfer: JSON.parse(localStorage.getItem("transfers")).find(
        (transfer) => transfer.bookingNumber === this.props.match.params.id
      ),
      transferEquipments: undefined,
    };
  }
  render() {
    return (
      <div className="transfer-details">
        <div className="toolbar">
          <button
            onClick={(e) => {
              this.props.history.goBack();
            }}
          >
            {"<"}
          </button>
        </div>
        <div className="transfer-data-wrapper">
          <TransferData
            transfer={this.state.transfer}
            transferEquipments={this.state.transferEquipments}
          ></TransferData>
        </div>
        <Locations
          tspID={this.state.transfer.transportServiceProviderID}
          bookingNumber={this.state.transfer.bookingNumber}
          originLocation={this.state.transfer.transferData.originLocation}
          destinationLocation={
            this.state.transfer.transferData.destinationLocation
          }
          onTeFetch={(te) =>
            this.setState((prev) => ({
              ...prev,
              transferEquipments: te,
            }))
          }
        ></Locations>
      </div>
    );
  }
}
