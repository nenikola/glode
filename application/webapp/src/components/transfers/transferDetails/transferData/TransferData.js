import React from "react";
import "./TransferData.css";
// import TransferEquipmentType from "app-shared-library";
const TransferInfo = (props) => {
  return (
    <div className="transfer-data">
      <div className="info-data">
        <h4>Booking number</h4>
        <p>{props.transfer.bookingNumber}</p>
      </div>

      <div className="info-data">
        <h4>Transport Service Provider ID</h4>
        <p>{props.transfer.transportServiceProvider.organizationID}</p>
      </div>
      <div className="info-data">
        <h4>Transport Service Provider Name</h4>
        <p>{props.transfer.transportServiceProvider.organizationName}</p>
      </div>
      <div className="info-data">
        <h4>Planned Departure</h4>
        <p>{props.transfer.plannedDeparture || "N/A"}</p>
      </div>
      <div className="info-data">
        <h4>Planned Arrival:</h4>
        <p>{props.transfer.plannedArrival || "N/A"}</p>
      </div>
      <div className="info-data te">
        <h4>
          Transfer Equipment:{" "}
          {props.transfer.transportServiceProvider.organizationID ===
          localStorage.getItem("org") ? (
            <button onClick={(e) => props.onTeAssign()}>{"Assign new"}</button>
          ) : (
            ""
          )}
        </h4>
        <hr></hr>
        {props.transferEquipments &&
          props.transferEquipments.map((t) => (
            <div>
              <h5>Registration number:</h5>
              <p> {t.registrationNumber || "N/A"} </p>
              <h5>TE Type:</h5>
              <p>{t.transferEquipmentType.teTypeName || "N/A"}</p>
              <hr></hr>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TransferInfo;
