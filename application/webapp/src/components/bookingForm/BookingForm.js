import React, { Component } from "react";
import BookingInfoForm from "./bookingInfoForm/BookingInfoForm";
import "./BookingForm.css";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { post } from "axios";

export default class BookingForm extends Component {
  constructor() {
    super();
    this.state = {
      booking: {
        bookingID: "",
        bookingOrgID: "",
        bookingStatus: "SUBMITTED",
        equipmentData: {
          transferEquipmentQuantity: "",
          transferEquipmentType: "",
        },
        transferData: {
          destinationLocation: {
            address: {
              address: "",
              city: "",
              country: "",
            },
            geoCoordinates: {
              lat: 0,
              lon: 0,
            },
            unlocode: "",
          },
          originLocation: {
            address: {
              address: "",
              city: "",
              country: "",
            },
            geoCoordinates: {
              lat: 0,
              lon: 0,
            },
            unlocode: "",
          },
          requestedArrival: "",
          requestedDeparture: "",
        },
        transportServiceProviderID: "",
        transportServiceProviderName: "",
        uniqueAssociatedTransfersSecret: "",
      },
    };
  }
  render() {
    return (
      <div
        className="booking-form"
        style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}
      >
        <BookingInfoForm
          ref="infoForm"
          bookingID={this.state.booking.uniqueAssociatedTransfersSecret}
        ></BookingInfoForm>
        <h4 style={{ marginLeft: "5%" }}>Details:</h4>
        <hr style={{ margin: "0 auto", width: "94%", color: "lightgray" }}></hr>
        <div style={{ flexGrow: 1, maxHeight: "", overflowY: "hidden" }}>
          <SimpleBar style={{ maxHeight: "100%" }}>
            <div className="booking-details-data">
              <h4>Origin Location:</h4>
              <div className="sub-data">
                <h5>Address:</h5>
                <input
                  value={
                    this.state.booking.transferData.originLocation.address
                      .address
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.transferData.originLocation.address.address = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
              <div className="sub-data">
                <h5>City</h5>
                <input
                  value={
                    this.state.booking.transferData.originLocation.address.city
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.transferData.originLocation.address.city = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
              <div className="sub-data">
                <h5>Country:</h5>
                <input
                  value={
                    this.state.booking.transferData.originLocation.address
                      .country
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.transferData.originLocation.address.country = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
              <div className="sub-data">
                <h5>UNLOCODE:</h5>
                <input
                  value={
                    this.state.booking.transferData.originLocation.unlocode
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.transferData.originLocation.unlocode = val;
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
                  value={
                    this.state.booking.transferData.destinationLocation.address
                      .address
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.transferData.destinationLocation.address.address = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
              <div className="sub-data">
                <h5>City</h5>
                <input
                  value={
                    this.state.booking.transferData.destinationLocation.address
                      .city
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.transferData.destinationLocation.address.city = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
              <div className="sub-data">
                <h5>Country:</h5>
                <input
                  value={
                    this.state.booking.transferData.destinationLocation.address
                      .country
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.transferData.destinationLocation.address.country = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
              <div className="sub-data">
                <h5>UNLOCODE:</h5>
                <input
                  value={
                    this.state.booking.transferData.destinationLocation.unlocode
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.transferData.destinationLocation.unlocode = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
            </div>
            <div className="booking-details-data">
              <h4>Requested Departure:</h4>
              <div className="sub-data">
                <h5>Date:</h5>
                <input ref="depDateInput"></input>
              </div>
              <div className="sub-data">
                <h5>Time:</h5>
                <input></input>
              </div>
            </div>
            <div className="booking-details-data">
              <h4>Requested Arrival:</h4>
              <div className="sub-data">
                <h5>Date:</h5>
                <input ref="arrDateInput"></input>
              </div>
              <div className="sub-data">
                <h5>Time:</h5>
                <input></input>
              </div>
            </div>
            <div className="booking-details-data">
              <h4>Transfer equipmentData Data:</h4>
              <div className="sub-data">
                <h5>Transfer Equipment Type:</h5>
                <input
                  value={this.state.booking.equipmentData.transferEquipmentType}
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.equipmentData.transferEquipmentType = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
              <div className="sub-data">
                <h5>Transfer Equipment Quantity:</h5>
                <input
                  value={
                    this.state.booking.equipmentData.transferEquipmentQuantity
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    this.setState((prevstate) => {
                      prevstate.booking.equipmentData.transferEquipmentQuantity = val;
                      return prevstate;
                    });
                  }}
                ></input>
              </div>
            </div>
          </SimpleBar>
        </div>
        <div className="buttons-wrapper">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              let booking = {
                ...this.state.booking,
                ...this.refs.infoForm.getData(),
                uniqueAssociatedTransfersSecret: this.refs.infoForm.getData()
                  .bookingID,
                bookingStatus: "SUBMITTED",
              };
              console.log(
                JSON.stringify(this.refs.infoForm.getData(), null, 2)
              );
              booking.transferData.requestedArrival = this.refs.arrDateInput.value;
              booking.transferData.requestedDeparture = this.refs.depDateInput.value;
              console.log(JSON.stringify(booking, null, 2));
              post("http://localhost:5000/bookings/", booking, {
                headers: {
                  "Allow-Cross-Origin-Access": "*",
                  Authorization: "Bearer " + localStorage.getItem("auth"),
                },
              })
                .then((res) => {
                  alert(JSON.stringify(res));
                  console.log(res);
                })
                .catch((err) => alert(JSON.stringify(err)));
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
