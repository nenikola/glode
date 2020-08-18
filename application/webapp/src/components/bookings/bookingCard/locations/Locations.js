import React from "react";
import { ReactComponent as PinPic } from "./placeholder.svg";
import "./Locations.css";
function Locations(props) {
  return (
    <div className="locations">
      <div className="data-container">
        <div className="location-data">
          <p>Origin Location:</p>
          <p>{props.booking.transferData.originLocation.address.address}</p>
          <p>{props.booking.transferData.originLocation.address.city}</p>
          <p>{props.booking.transferData.originLocation.address.country} </p>
        </div>
        <div className="location-data">
          <p>Destination Location:</p>
          <p>
            {props.booking.transferData.destinationLocation.address.address}
          </p>
          <p>{props.booking.transferData.destinationLocation.address.city}</p>
          <p>
            {props.booking.transferData.destinationLocation.address.country}
          </p>
        </div>
      </div>
      <div
        style={{
          display: props.active ? "flex" : "none",
          justifyContent: "center",
        }}
      >
        <div className="blackdot">
          <PinPic className="pinpic"></PinPic>
          <p>[{props.booking.transferData.originLocation.unlocode}]</p>
        </div>
        <div className="blackline"></div>
        <div className="blackdot">
          <PinPic className="pinpic"></PinPic>
          <p>[{props.booking.transferData.destinationLocation.unlocode}]</p>
        </div>
      </div>
    </div>
  );
}

export default Locations;
