import React, { Component } from "react";
import "./TransferEquipmentEventForm.css";
import ApiService from "../../../service/ApiService";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TransferEquipmentEventTypes } from "app-shared-library";
export default class TransferEquipmentEventForm extends Component {
  async submitTransferEquipmentEvent() {
    const response = await ApiService.submitTransferEquipmentEvent(
      this.state.transferEquipmentEventDTO
    );
    console.log(response);
    this.setState({ dialogContent: response });
  }

  constructor(props) {
    console.log("PROPS:", JSON.stringify(props));
    super(props);
    this.state = {
      dialogContent: undefined,
      transferEquipmentEventDTO: {
        associatedTransferData: {
          tspID: props.tspID,
          bookingNumber: props.bookingNumber,
        },
        eventLocation: {
          address: undefined,
          city: undefined,
          country: undefined,
          geoCoordinates: {
            lat: undefined,
            lon: undefined,
          },
        },
        eventOccuranceTime: new Date(),
        transferEquipmentEventType: "",
        registrationNumber: props.registrationNumber,
      },
    };
  }
  componentDidUpdate() {
    if (
      this.state.transferEquipmentEventDTO.registrationNumber !==
      this.props.registrationNumber
    ) {
      this.setState((prev) => {
        prev.transferEquipmentEventDTO.registrationNumber = this.props.registrationNumber;
        return { ...prev };
      });
    }
  }
  render() {
    console.log(this.state.transferEquipmentEventDTO);
    console.log("RENDER...", this.props);
    return (
      <div className={"equipment-event-form"}>
        <Dialog
          header={
            this.state.dialogContent &&
            (this.state.dialogContent.status === 201 ? "SUCCESS" : "FAILURE")
          }
          footer={
            <div>
              <Button
                style={{
                  color: "white",
                  backgroundColor:
                    this.state.dialogContent &&
                    (this.state.dialogContent.status === 201
                      ? "lightseagreen"
                      : "red"),
                }}
                label="Ok"
                onClick={() => this.props.onEventSubmitted()}
              />
            </div>
          }
          visible={this.state.dialogContent}
          style={{ width: "50vw" }}
          modal
          onHide={() => this.setState({ dialogContent: undefined })}
        >
          {this.state.dialogContent && this.state.dialogContent.message}
        </Dialog>
        <div className={"form-field"}>
          <div className={"form-field"}>
            <h4>Transfer: </h4>
            <input
              className="transfer"
              value={`${this.state.transferEquipmentEventDTO.associatedTransferData.tspID}-${this.state.transferEquipmentEventDTO.associatedTransferData.bookingNumber}`}
              disabled
            ></input>
          </div>
          <div className={"form-field"}>
            <h4>Registration: </h4>
            <input
              disabled
              className="registration-number"
              value={this.props.registrationNumber}
            ></input>
          </div>
        </div>

        <div className={"form-field"}>
          <h4>Event type: </h4>
          <div className="dropdown-wrapper">
            <Dropdown
              value={
                this.state.transferEquipmentEventDTO.transferEquipmentEventType
              }
              optionLabel={"teEventTypeName"}
              showClear={true}
              options={[
                TransferEquipmentEventTypes.COMMODITY_LOADED,
                TransferEquipmentEventTypes.COMMODITY_UNLOADED,
                TransferEquipmentEventTypes.GATE_IN,
                TransferEquipmentEventTypes.GATE_OUT,
                TransferEquipmentEventTypes.LOADED_ON,
                TransferEquipmentEventTypes.LOADED_OFF,
              ]}
              onChange={(e) => {
                const val = e.target.value;
                this.setState((prevstate) => {
                  prevstate.transferEquipmentEventDTO.transferEquipmentEventType = val;
                  return prevstate;
                });
              }}
              placeholder="Select a TE Event type"
            />
          </div>
        </div>
        <div className={"form-multiple"}>
          <h4>Current location: </h4>
          <div>
            <div className={"form-field"}>
              <h5>Address: </h5>
              <input
                className="address"
                value={
                  this.state.transferEquipmentEventDTO.eventLocation.address
                }
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.transferEquipmentEventDTO.eventLocation.address = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className={"form-field"}>
              <h5>City: </h5>
              <input
                className="city"
                value={this.state.transferEquipmentEventDTO.eventLocation.city}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.transferEquipmentEventDTO.eventLocation.city = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className={"form-field"}>
              <h5>Country: </h5>
              <input
                className="country"
                value={
                  this.state.transferEquipmentEventDTO.eventLocation.country
                }
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.transferEquipmentEventDTO.eventLocation.country = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className={"form-field"}>
              <h5>Geolocation - Latitude: </h5>
              <input
                className="latitude"
                value={
                  this.state.transferEquipmentEventDTO.eventLocation
                    .geoCoordinates.lat
                }
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.transferEquipmentEventDTO.eventLocation.geoCoordinates.lat = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className={"form-field"}>
              <h5>Geolocation - longitude: </h5>
              <input
                className="longitude"
                value={
                  this.state.transferEquipmentEventDTO.eventLocation
                    .geoCoordinates.lon
                }
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.transferEquipmentEventDTO.eventLocation.geoCoordinates.lon = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
          </div>
        </div>

        <div className={"form-submit"}>
          <button
            onClick={() => {
              this.submitTransferEquipmentEvent();
            }}
          >
            Submit event
          </button>
        </div>
      </div>
    );
  }
}
