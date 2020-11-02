import React, { Component } from "react";
import "./BookingCard.css";

import LocationsPanel from "./locationsPanel/LocationsPanel";
import BookingInfo from "./bookingInfo/BookingInfo";
import BookingDetails from "./bookingDetails/BookingDetails";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
class BookingCard extends Component {
  constructor() {
    super();
    this.state = {
      dialogContent: undefined,
      active: false,
    };
  }
  render() {
    return (
      <div
        className={this.state.active ? "booking active" : "booking"}
        onClick={(e) => {
          console.log(e.target);
          this.setState((state) => ({ active: !state.active }));
        }}
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
                    (this.state.dialogContent.status === 200
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
        <BookingInfo booking={this.props.booking}></BookingInfo>
        <hr style={{ width: "100%", color: "lightgray" }}></hr>
        <LocationsPanel
          active={this.state.active}
          booking={this.props.booking}
        ></LocationsPanel>
        <BookingDetails
          active={this.state.active}
          booking={this.props.booking}
          onUpdateStatus={(res) => this.setState({ dialogContent: res })}
        ></BookingDetails>
        <div className="expand-arrow">
          {this.state.active ? <p>&#9650;</p> : <p> &#9660;</p>}
        </div>
      </div>
    );
  }
}
export default BookingCard;
