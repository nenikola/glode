import React from "react";
import LoadingCircle from "../../../../loadingCirle/LoadingCircle";
import SimpleBar from "simplebar-react";
import "./TransferEventInfo.css";
import * as moment from "moment";

const TransferEventInfo = (props) => {
  return (
    <div className="info">
      <div className="destination-origin">
        <div className="info-data">
          <div>
            <h4>Origin location:</h4>
            <p>{props.originLocation.address}</p>
            <p>
              {props.originLocation.city}
              {" - "}
              {props.originLocation.country}
            </p>
          </div>
        </div>
        <div className="info-data">
          <div>
            <h4>Destination location:</h4>
            <p>{props.destinationLocation.address}</p>
            <p>
              {props.destinationLocation.city}
              {" - "}
              {props.destinationLocation.country}
            </p>
          </div>
        </div>
      </div>
      <h4>Events:</h4>
      <div className="te-events">
        <SimpleBar style={{ width: "100%", height: "100%" }}>
          {props.transferEquipments ? (
            props.transferEquipments.map(
              (te) =>
                te.events &&
                te.events.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="info-data"
                      onClick={() => {
                        props.onTeEventClick(JSON.stringify(e));
                      }}
                    >
                      <div className="flags">
                        {JSON.stringify(te.currentLocation) ===
                        JSON.stringify(e.eventLocation) ? (
                          <div className="flag current-loc">
                            CURRENT LOCATION
                          </div>
                        ) : (
                          ""
                        )}
                        {!e.eventLocation.geoCoordinates ? (
                          <div className="flag no-coords">NO GEOLOCATION</div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        <h4>- Type:</h4>
                        <p>{e.transferEquipmentEventType}</p>
                      </div>
                      <div>
                        <h4>- Location:</h4>
                        <p>{e.eventLocation ? e.eventLocation.address : ""}</p>
                        <p>
                          {e.eventLocation ? e.eventLocation.city : ""}
                          {"  "}
                          {e.eventLocation ? e.eventLocation.country : ""}
                          {e.eventLocation.unlocode
                            ? `  [${e.eventLocation.unlocode}]`
                            : ""}
                        </p>
                      </div>
                      <div>
                        <h4>- Occurance Time:</h4>
                        <p>
                          {e.eventOccuranceTime
                            ? moment(e.eventOccuranceTime).format("DD.MM.YYYY.")
                            : "N / A"}
                        </p>
                      </div>
                    </div>
                  );
                })
            )
          ) : (
            <LoadingCircle active={props.transferEquipments}></LoadingCircle>
          )}
        </SimpleBar>
      </div>
    </div>
  );
};

export default TransferEventInfo;
