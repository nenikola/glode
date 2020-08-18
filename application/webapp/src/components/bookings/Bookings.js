import React, { Component } from "react";
import { DataScroller } from "primereact/datascroller";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { get } from "axios";
import "./Bookings.css";
import BookingCard from "./bookingCard/BookingCard";
import { Link } from "react-router-dom";
export default class Bookings extends Component {
  constructor() {
    super();
    this.state = {
      bookings: JSON.parse(localStorage.getItem("bookings")) || [],
      filters: {
        orgRole: 0,
        status: 0,
      },
    };
  }
  componentDidMount() {
    const bookings = JSON.parse(localStorage.getItem("bookings"));
    console.log(bookings);
    if (!bookings) {
      get("http://localhost:5000/bookings", {
        headers: {
          "Allow-Cross-Origin-Access": "*",
          Authorization: "Bearer " + localStorage.getItem("auth"),
        },
      })
        .then((res) => {
          console.log("update");
          localStorage.setItem("bookings", JSON.stringify(res.data.data));
          this.setState({
            bookings: res.data.data,
          });
        })
        .catch((err) => console.log(err));
    }
  }
  itemTemplate(booking, layout) {
    return <BookingCard booking={booking} />;
  }

  render() {
    return (
      <div className="bookings-container">
        <div className="bookings-toolbar">
          <Link to="createBooking">
            <button>create new booking</button>
          </Link>
          <button>create new </button>
          <button>create booking</button>
        </div>
        <div className="scrollbar-wrapper">
          <SimpleBar
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              paddingRight: "10px",
              paddingLeft: "5px",
            }}
          >
            <DataScroller
              value={this.state.bookings}
              rows={this.state.bookings.length}
              itemTemplate={this.itemTemplate}
            ></DataScroller>
          </SimpleBar>
        </div>
      </div>
    );
  }
}
