import React, { Component } from "react";
import { DataScroller } from "primereact/datascroller";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { get } from "axios";
import BookingCard from "./bookingCard/BookingCard";
import { Link } from "react-router-dom";
import BookingFilters from "./bookingFilters/BookingFilters";
import "./Bookings.css";
import { BookingStatuses } from "app-shared-library";
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
    // if (!bookings) {
    //   get("http://localhost:5000/bookings", {
    //     headers: {
    //       "Allow-Cross-Origin-Access": "*",
    //       Authorization: "Bearer " + localStorage.getItem("auth"),
    //     },
    //   })
    //     .then((res) => {
    //       console.log("update");
    //       localStorage.setItem("bookings", JSON.stringify(res.data.data));
    //       this.setState({
    //         bookings: res.data.data,
    //       });
    //     })
    //     .catch((err) => console.log(err));
    // }
    this.queryBookings();
  }
  itemTemplate(booking, layout) {
    return <BookingCard booking={booking} />;
  }

  queryBookings(filters) {
    console.log(BookingStatuses["SUBMITTED"]);

    console.log(JSON.stringify(filters));
    get("http://localhost:5000/bookings", {
      params: filters,
      headers: {
        "Allow-Cross-Origin-Access": "*",
        Authorization: "Bearer " + localStorage.getItem("auth"),
      },
    })
      .then((res) => {
        console.log("update", JSON.stringify(res.data.data, null, 2));
        localStorage.setItem(
          "bookings",
          JSON.stringify(res.data.data.reverse())
        );
        console.log(res.data.data);
        console.log("reverse", res.data.data.reverse());
        this.setState({
          bookings: res.data.data.reverse(),
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="bookings-container">
        <div className="bookings-toolbar">
          <div className="booking-filters-wrapper">
            <BookingFilters
              onQuery={(filters) => this.queryBookings(filters)}
            ></BookingFilters>
          </div>
          <Link to="createBooking">
            <button>create new booking</button>
          </Link>
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
            {this.state.bookings.map((booking) => this.itemTemplate(booking))}
          </SimpleBar>
        </div>
      </div>
    );
  }
}

{
  /* <DataScroller
            
value={this.state.bookings}
rows={this.state.bookings.length}
itemTemplate={this.itemTemplate}
></DataScroller> */
}
