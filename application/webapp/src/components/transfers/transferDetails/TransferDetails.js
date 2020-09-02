import React, { Component } from "react";
import "./TransferDetails.css";
import Locations from "./locations/Locations";
import TransferData from "./transferData/TransferData";
import { get, post } from "axios";
import { ListBox } from "primereact/listbox";
import LoadingCircle from "../../loadingCirle/LoadingCircle";
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
  toggleTeAssignment(fetch) {
    this.teAssignment.classList.toggle("active");
    get(
      `http://localhost:5000/te/available?tspID=${this.state.transfer.transportServiceProvider.organizationID}&bookingNumber=${this.state.transfer.bookingNumber}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      }
    )
      .then((res) => {
        this.setState((prev) => ({ ...prev, availableTe: res.data }));
      })
      .catch((err) => this.setState((prev) => ({ ...prev, availableTe: err })));
  }
  render() {
    return (
      <div className="transfer-details">
        <div ref={(el) => (this.teAssignment = el)} className="te-assignment">
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
              {this.state.availableTe &&
              typeof this.state.availableTe.length ? (
                <ListBox
                  value={this.state.selectedTe}
                  options={this.state.availableTe}
                  onChange={(e) => this.setState({ selectedTe: e.value })}
                  itemTemplate={(option) =>
                    `${option.registrationNumber} === ${JSON.stringify(
                      option.currentLocation
                    )}`
                  }
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  Available TransferEquipment could not be found.
                </div>
              )}
            </div>
            {this.state.availableTe &&
            typeof this.state.availableTe == "array" ? (
              <button
                className="assign"
                onClick={(e) => {
                  this.state.selectedTe &&
                    post(
                      "http://localhost:5000/te/associate",
                      {
                        tspID: this.state.transfer.transportServiceProviderID,
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
