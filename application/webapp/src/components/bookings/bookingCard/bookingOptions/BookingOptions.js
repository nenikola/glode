import React from "react";
import { post } from "axios";
import { BookingStatuses } from "app-shared-library";

const BookingOptions = (props) => {
  console.log(JSON.stringify(props.booking));
  return (
    <div>
      {props.booking.transportServiceProvider.organizationID ===
        localStorage.getItem("org") &&
      props.booking.bookingStatus &&
      props.booking.bookingStatus.bookingStatusName === "SUBMITTED" ? (
        <div
          className={
            props.active ? "buttons-wrapper active" : "buttons-wrapper"
          }
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              let booking = { ...props.booking };
              console.log(
                JSON.stringify({ status: "APPROVED", booking: booking })
              );
              post(
                "http://localhost:5000/bookings/updateStatus",
                { status: BookingStatuses.APPROVED, booking: booking },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "Allow-Cross-Origin-Access": "*",
                    Authorization: "Bearer " + localStorage.getItem("auth"),
                  },
                }
              )
                .then((res) => {
                  alert(res);
                  console.log(res);
                })
                .catch((err) => alert(err));
            }}
          >
            Accept
          </button>
          <button
            className="btn-reject"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            Reject
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default BookingOptions;
