import React, { Component } from "react";
import "./TransferDetails.css";
import Locations from "./locations/Locations";
import TransferData from "./transferData/TransferData";
import { get, post } from "axios";
import { ListBox } from "primereact/listbox";
import LoadingCircle from "../../loadingCirle/LoadingCircle";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import ApiService from "../../../service/ApiService";
import TransferEquipmentEventForm from "../../transferEquipment/transferEquipmentEventForm/TransferEquipmentEventForm";
export default class TransferDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transfer:
        props.transfer ||
        JSON.parse(localStorage.getItem("transfers")).find(
          (transfer) => transfer.bookingNumber === this.props.match.params.id
        ),
      transferEquipments: undefined,
      selectedTe: undefined,
    };
  }
  async toggleTeAssignment(fetch) {
    this.teAssignment.classList.toggle("active");
    ApiService.getAvailableTEforTransfer(
      this.state.transfer.transportServiceProvider.organizationID,
      this.state.transfer.bookingNumber
    )
      .then((res) => {
        this.setState((prev) => ({ ...prev, availableTe: res.data }));
      })
      .catch((err) => this.setState((prev) => ({ ...prev, availableTe: err })));
  }
  onEventSubmitted = () => {
    console.log("ccccccc");
    this.toggleTeEventForm(undefined);
    this.props.history.go(0);
  };

  toggleTeEventForm = (regNum) => {
    this.teEventForm.classList.toggle("active");
    this.setState({ selectedTe: regNum });
  };
  render() {
    return (
      <div className="transfer-details">
        <div ref={(el) => (this.teAssignment = el)} className="te-assignment">
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
          <div className="data">
            <button
              onClick={(e) => {
                this.toggleTeAssignment(false);
                this.setState({
                  selectedTe: undefined,
                });
              }}
            >
              {"<"}
            </button>
            <div className="availables-list">
              Available Transfer Equipment:
              {<LoadingCircle active={this.state.availableTe}></LoadingCircle>}
              {this.state.availableTe && this.state.availableTe.length > 0 ? (
                <ListBox
                  value={this.state.selectedTe}
                  options={this.state.availableTe}
                  onChange={(e) => this.setState({ selectedTe: e.value })}
                  itemTemplate={(option) => (
                    <div className={"te-available-item"}>
                      <div>
                        <h5>Registration:</h5>
                        <p>{option.registrationNumber}</p>
                      </div>
                      <div>
                        <h5>Owner:</h5>
                        <p>{option.owner.organizationName}</p>
                      </div>
                      <div>
                        <h5>Current location::</h5>
                        <p>{` ${option.currentLocation.address || "/"}, ${
                          option.currentLocation.city || "/"
                        }, ${option.currentLocation.country || "/"} [lat: ${
                          option.currentLocation.geoCoordinates.lat
                        }, lon: ${
                          option.currentLocation.geoCoordinates.lon
                        }]`}</p>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  Available TransferEquipment could not be found.
                </div>
              )}
            </div>
            {this.state.availableTe && this.state.availableTe.length > 0 ? (
              <button
                className="assign"
                onClick={(e) => {
                  this.state.selectedTe &&
                    post(
                      "http://localhost:5000/te/associate",
                      {
                        tspID: this.state.transfer.transportServiceProvider
                          .organizationID,
                        bookingNumber: this.state.transfer.bookingNumber,
                        registrationNumber: this.state.selectedTe
                          .registrationNumber,
                      },
                      {
                        headers: {
                          "Allow-Cross-Origin-Access": "*",
                          Authorization:
                            "Bearer " + localStorage.getItem("auth"),
                        },
                      }
                    ).then((res) => {
                      alert(JSON.stringify(res.data));
                      this.toggleTeAssignment();
                      this.setState({
                        selectedTe: undefined,
                      });
                      this.props.history.go(0);
                    });
                }}
              >
                Assign
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div ref={(el) => (this.teEventForm = el)} className="te-event-form">
          <div className="data">
            <button
              className={"back"}
              onClick={(e) => {
                this.toggleTeEventForm(false);
                this.setState({
                  selectedTe: undefined,
                });
              }}
            >
              {"<"}
            </button>
            <TransferEquipmentEventForm
              tspID={
                this.state.transfer.transportServiceProvider.organizationID
              }
              bookingNumber={this.state.transfer.bookingNumber}
              registrationNumber={this.state.selectedTe}
              onEventSubmitted={() => this.onEventSubmitted()}
            ></TransferEquipmentEventForm>
          </div>
        </div>
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
            onTeAssign={() => {
              this.toggleTeAssignment(true);
            }}
            onEventSubmit={(regNum) => {
              this.toggleTeEventForm(regNum);
            }}
          ></TransferData>
        </div>
        <Locations
          tspID={this.state.transfer.transportServiceProvider.organizationID}
          bookingNumber={this.state.transfer.bookingNumber}
          originLocation={this.state.transfer.originLocation}
          destinationLocation={this.state.transfer.destinationLocation}
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
