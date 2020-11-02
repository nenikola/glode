import React, { Component } from "react";
import BookingInfoForm from "./bookingInfoForm/BookingInfoForm";
import "./BookingForm.css";
import "simplebar/dist/simplebar.min.css";
import { post } from "axios";
import { Calendar } from "primereact/calendar";
import { TransferEquipmentTypes, BookingStatuses } from "app-shared-library";
import { Dropdown } from "primereact/dropdown";
import { get } from "axios";
import { v4 as uuidv4 } from "uuid";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export default class BookingForm extends Component {
  constructor() {
    super();
    this.state = {
      dialogContent: undefined,
      booking: {
        bookingID: "",
        bookingOrg: "",
        bookingStatus: "SUBMITTED",
        transferEquipmentQuantity: "",
        transferEquipmentType: "",
        destinationLocation: {
          address: "",
          city: "",
          country: "",
          geoCoordinates: {
            lat: undefined,
            lon: undefined,
          },
        },
        originLocation: {
          address: "",
          city: "",
          country: "",
          geoCoordinates: {
            lat: undefined,
            lon: undefined,
          },
        },
        requestedArrival: "",
        requestedDeparture: "",
        transportServiceProvider: "",
        associationID: "",
      },
      possibleTransfers: "",
    };
  }
  componentDidMount() {
    if (!this.state.possibleTransfers) {
      get("http://localhost:5000/transfers", {
        headers: {
          "Allow-Cross-Origin-Access": "*",
          Authorization: "Bearer " + localStorage.getItem("auth"),
        },
      })
        .then((res) => {
          console.log("update");
          this.setState({
            possibleTransfers: res.data,
          });
        })
        .catch((err) => console.log(err));
    }
  }
  valueTemplate(option, props) {
    console.log("aaaaaa");
    if (option) {
      console.log(option);
      return (
        <div>
          ASSOCIATION KEY: {option.associationID}TSP:{" "}
          {option.transportServiceProvider.organizationName}
          BookingNumber: {option.bookingNumber}
        </div>
      );
    }
    return props.placeholder;
  }
  render() {
    return (
      <div
        className="booking-form"
        style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}
      >
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
        <BookingInfoForm
          ref="infoForm"
          bookingID={this.state.booking.associationID}
        ></BookingInfoForm>
        <h4 style={{ marginLeft: "5%" }}>Details:</h4>
        <hr style={{ margin: "0 auto", width: "94%", color: "lightgray" }}></hr>

        <div style={{ flexGrow: 1, maxHeight: "" }}>
          <div className="booking-details-data">
            <h4>Origin Location:</h4>
            <div className="sub-data">
              <h5>Address:</h5>
              <input
                value={this.state.booking.originLocation.address}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.originLocation.address = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className="sub-data">
              <h5>City</h5>
              <input
                value={this.state.booking.originLocation.city}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.originLocation.city = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className="sub-data">
              <h5>Country:</h5>
              <input
                value={this.state.booking.originLocation.country}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.originLocation.country = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className="sub-data">
              <h5>GeoLocation- Latitude:</h5>
              <input
                value={this.state.booking.originLocation.geoCoordinates.lat}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.originLocation.geoCoordinates.lat = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className="sub-data">
              <h5>GeoLocation- Longitude:</h5>
              <input
                value={this.state.booking.originLocation.geoCoordinates.lon}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.originLocation.geoCoordinates.lon = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
          </div>

          <div className="booking-details-data">
            <h4>Destination Location:</h4>
            <div className="sub-data">
              <h5>Address:</h5>
              <input
                value={this.state.booking.destinationLocation.address}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.destinationLocation.address = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className="sub-data">
              <h5>City</h5>
              <input
                value={this.state.booking.destinationLocation.city}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.destinationLocation.city = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className="sub-data">
              <h5>Country:</h5>
              <input
                value={this.state.booking.destinationLocation.country}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.destinationLocation.country = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className="sub-data">
              <h5>GeoLocation- Latitude:</h5>
              <input
                value={
                  this.state.booking.destinationLocation.geoCoordinates.lat
                }
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.destinationLocation.geoCoordinates.lat = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
            <div className="sub-data">
              <h5>GeoLocation- Longitude:</h5>
              <input
                value={
                  this.state.booking.destinationLocation.geoCoordinates.lon
                }
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.destinationLocation.geoCoordinates.lon = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
          </div>
          <div className="booking-details-data">
            <h4>Requested Departure:</h4>
            <div className="calendar-wrapper sub-data">
              <Calendar
                showIcon={true}
                value={this.state.booking.requestedDeparture}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.requestedDeparture = val;
                    return prevstate;
                  });
                }}
              ></Calendar>
            </div>
            <h4>Requested Arrival:</h4>
            <div className="calendar-wrapper sub-data">
              <Calendar
                showIcon={true}
                value={this.state.requestedArrival}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.requestedArrival = val;
                    return prevstate;
                  });
                }}
              ></Calendar>
            </div>
          </div>
          <div className="booking-details-data">
            <h4>Transfer Equipment:</h4>
            <div className="sub-data">
              <h5>Transfer Equipment Type:</h5>
              <div className="dropdown-wrapper">
                <Dropdown
                  showClear={true}
                  value={this.state.booking.transferEquipmentType}
                  optionLabel={"teTypeName"}
                  showClear={true}
                  options={[
                    TransferEquipmentTypes.TWNYFTCONTAINER,
                    TransferEquipmentTypes.FRTYFTCONTAINER,
                  ]}
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.transferEquipmentType = val;
                      return prevstate;
                    });
                  }}
                  placeholder="Select a TE type"
                />
              </div>
            </div>
            <div className="sub-data">
              <h5>Transfer Equipment Quantity:</h5>
              <input
                value={this.state.booking.transferEquipmentQuantity}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState((prevstate) => {
                    prevstate.booking.transferEquipmentQuantity = val;
                    return prevstate;
                  });
                }}
              ></input>
            </div>
          </div>
          <div className="booking-details-data">
            <h4>Connect to transfer:</h4>
            <div className="transfers-dropdown">
              <h5>Transfer Equipment Type:</h5>
              <div className="dropdown-wrapper">
                <Dropdown
                  showClear={true}
                  value={this.state.selectedTransfer}
                  options={this.state.possibleTransfers}
                  optionLabel={"bookingNumber"}
                  valueTemplate={this.valueTemplate}
                  itemTemplate={(transfer) =>
                    `TSP: ${transfer.transportServiceProvider.organizationName} BookingNumber: ${transfer.bookingNumber}`
                  }
                  onChange={(e) => {
                    this.setState({
                      selectedTransfer: e.value,
                    });
                  }}
                  placeholder="Select transfer to connect"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="buttons-wrapper">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              let booking = {
                ...this.state.booking,
                ...this.refs.infoForm.getData(),
                associationID: this.state.selectedTransfer
                  ? this.state.selectedTransfer.associationID
                  : uuidv4(),
                bookingStatus: BookingStatuses.SUBMITTED,
              };
              console.log(
                JSON.stringify(this.refs.infoForm.getData(), null, 2)
              );
              console.log(JSON.stringify(booking, null, 2));
              post("http://localhost:5000/bookings/", booking, {
                headers: {
                  "Allow-Cross-Origin-Access": "*",
                  Authorization: "Bearer " + localStorage.getItem("auth"),
                },
              })
                .then((res) => {
                  this.setState({
                    dialogContent: {
                      status: res.status,
                      message: "Booking successfully created!",
                    },
                  });
                  console.log(res);
                })
                .catch((err) =>
                  this.setState({
                    dialogContent: {
                      status: err.status,
                      message: "Booking could not be created!",
                    },
                  })
                );
            }}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
  // <button
  //   onClick={(e) => {
  //     alert(JSON.stringify(this.refs.infoForm.getData(), null, 2));
  //   }}
  // >
  //   X
  // </button>
}
