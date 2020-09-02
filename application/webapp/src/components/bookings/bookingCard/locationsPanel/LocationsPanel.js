import React from "react";
import { ReactComponent as PinPic } from "./placeholder.svg";
import "./LocationsPanel.css";
function LocationsPanel(props) {
  return (
    <div className="locations-panel">
      <div className="data-container">
        <div className="location-data">
          <p>Origin Location:</p>
          <p>{props.booking.originLocation.address}</p>
          <p>{props.booking.originLocation.city}</p>
          <p>{props.booking.originLocation.country} </p>
        </div>
        <div className="location-data">
          <p>Destination Location:</p>
          <p>{props.booking.destinationLocation.address}</p>
          <p>{props.booking.destinationLocation.city}</p>
          <p>{props.booking.destinationLocation.country}</p>
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
          <p>[{props.booking.originLocation.unlocode}]</p>
        </div>
        <div className="blackline"></div>
        <div className="blackdot">
          <PinPic className="pinpic"></PinPic>
          {props.booking.originLocation.unlocode ? (
            <p>[{props.booking.destinationLocation.unlocode}]</p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationsPanel;
