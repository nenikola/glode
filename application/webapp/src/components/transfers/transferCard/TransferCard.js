import React from "react";
import "./TransferCard.css";
import { TransferStatus } from "app-shared-library";
import moment from "moment";
import { Link } from "react-router-dom";
const TransferCard = (props) => {
  return (
    <Link to={`/transfers/${props.transfer.bookingNumber}`}>
      <div className="transfer-card" onClick={props.onClick}>
        <div className="data-field">
          <h4>BookingNumber:</h4>
          <p>{props.transfer.bookingNumber || "N / A"}</p>
        </div>
        <div className="data-field">
          <h4>Transport Service Provider [ID/Name]:</h4>
          <p>
            {props.transfer.transportServiceProviderID || "N / A"}
            {" / "}
            {props.transfer.transportServiceProviderName || "N / A"}
          </p>
        </div>
        <div className="data-field">
          <h4>Planned Departure:</h4>
          <p>
            {props.transfer.transferData.plannedDeparture
              ? moment(props.transfer.transferData.plannedDeparture).format(
                  "DD.MM.YYYY.  HH:mm "
                )
              : "N / A"}
          </p>
        </div>
        <div className="data-field">
          <h4>Planned Arrival:</h4>
          <p>
            {props.transfer.transferData.plannedArrival
              ? moment(props.transfer.transferData.plannedArrival).format(
                  "DD.MM.YYYY.  HH:mm "
                )
              : "N / A"}{" "}
          </p>
        </div>
        <div className="data-field">
          <h4>Status:</h4>
          <p>{TransferStatus[props.transfer.transferStatus] || "N / A"}</p>
        </div>
      </div>
    </Link>
  );
};

export default TransferCard;
