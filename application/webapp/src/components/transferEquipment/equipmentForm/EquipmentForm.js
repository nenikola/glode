import React, { Component } from "react";
import "./EquipmentForm.css";
import { TransferEquipmentTypes } from "app-shared-library";
import { Dropdown } from "primereact/dropdown";
import ApiService from "../../../service/ApiService";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export default class EquipmentForm extends Component {
  async createTransferEquipment() {
    const response = await ApiService.createTransferEquipment(
      this.state.transferEquipment
    );
    console.log(response);
    this.setState({ dialogContent: response });
  }

  constructor(props) {
    super(props);
    this.state = {
      dialogContent: undefined,
      transferEquipment: {
        registrationNumber: undefined,
        owner: {
          organizationID: localStorage.getItem("org"),
          organizationName: localStorage.getItem("orgName"),
        },
        transferEquipmentType: undefined,
        currentLocation: {
          address: undefined,
          city: undefined,
          country: undefined,
          geoCoordinates: {
            lat: undefined,
            lon: undefined,
          },
        },
      },
    };
  }

  render() {
    return (
      <div className={"equipment-form-wrapper"}>
        <Dialog
          header={
            this.state.dialogContent &&
            (this.state.dialogContent.status === 201 ? "SUCCESS" : "FAILURE")
          }
          header={"SUCCESS"}
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
                onClick={() => this.setState({ dialogContent: undefined })}
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
        <div className={"equipment-form"}>
          <div className={"form-field"}>
            <h4>Owner organization: </h4>
            <input
              className="owner-name"
              value={this.state.transferEquipment.owner.organizationName}
              disabled
            ></input>
          </div>
          <div className={"form-field"}>
            <h4>Registration number: </h4>
            <input
              className="registration-number"
              value={this.state.transferEquipment.registrationNumber}
              onChange={(e) => {
                const val = e.target.value;
                this.setState((prevstate) => {
                  prevstate.transferEquipment.registrationNumber = val;
                  return prevstate;
                });
              }}
            ></input>
          </div>
          <div className={"form-field"}>
            <h4>Equipment type: </h4>
            <div className="dropdown-wrapper">
              <Dropdown
                showClear={true}
                value={this.state.transferEquipment.transferEquipmentType}
                optionLabel={"teTypeName"}
                showClear={true}
                options={[
                  TransferEquipmentTypes.TWNYFTCONTAINER,
                  TransferEquipmentTypes.FRTYFTCONTAINER,
                ]}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.transferEquipment.transferEquipmentType = val;
                    return prevstate;
                  });
                }}
                placeholder="Select a TE type"
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
                  value={this.state.transferEquipment.currentLocation.address}
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.transferEquipment.currentLocation.address = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
              <div className={"form-field"}>
                <h5>City: </h5>
                <input
                  className="city"
                  value={this.state.transferEquipment.currentLocation.city}
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.transferEquipment.currentLocation.city = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
              <div className={"form-field"}>
                <h5>Country: </h5>
                <input
                  className="country"
                  value={this.state.transferEquipment.currentLocation.country}
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.transferEquipment.currentLocation.country = val;
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
                    this.state.transferEquipment.currentLocation.geoCoordinates
                      .lat
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.transferEquipment.currentLocation.geoCoordinates.lat = val;
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
                    this.state.transferEquipment.currentLocation.geoCoordinates
                      .lon
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.transferEquipment.currentLocation.geoCoordinates.lon = val;
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
                this.createTransferEquipment();
              }}
            >
              Register TE
            </button>
          </div>
        </div>
      </div>
    );
  }
}
