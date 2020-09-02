import React from "react";
import "./TransferCard.css";
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
            {props.transfer.transportServiceProvider.organizationID || "N / A"}
            {" / "}
            {props.transfer.transportServiceProvider.organizationName ||
              "N / A"}
          </p>
        </div>
        <div className="data-field">
          <h4>Planned Departure:</h4>
          <p>
            {props.transfer.plannedDeparture
              ? moment(props.transfer.plannedDeparture).format(
                  "DD.MM.YYYY.  HH:mm "
                )
              : "N / A"}
          </p>
        </div>
        <div className="data-field">
          <h4>Planned Arrival:</h4>
          <p>
            {props.transfer.plannedArrival
              ? moment(props.transfer.plannedArrival).format(
                  "DD.MM.YYYY.  HH:mm "
                )
              : "N / A"}{" "}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TransferCard;
