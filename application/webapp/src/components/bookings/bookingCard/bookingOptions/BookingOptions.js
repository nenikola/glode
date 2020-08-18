import React from "react";
import { post } from "axios";

const BookingOptions = (props) => {
  return (
    <div>
      {props.booking.transportServiceProviderID ===
        localStorage.getItem("org") &&
      props.booking.bookingStatus === "SUBMITTED" ? (
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
                { status: "APPROVED", booking: booking },
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
