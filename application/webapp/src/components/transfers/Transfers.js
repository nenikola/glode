import React, { Component } from "react";
import { DataScroller } from "primereact/datascroller";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { get } from "axios";
import "./Transfers.css";
import TransferCard from "./transferCard/TransferCard";
import TransferFilters from "./transferFilters/TransferFilters";
// import BookingCard from "./transferCard/BookingCard";
// import { Link } from "react-router-dom";
export default class Transfers extends Component {
  constructor() {
    super();
    this.state = {
      transfers: JSON.parse(localStorage.getItem("transfers")) || [],
      filters: {
        orgRole: 0,
        status: 0,
      },
    };
  }
  componentDidMount() {
    const transfers = JSON.parse(localStorage.getItem("transfers"));
    console.log(transfers);
    if (!transfers) {
      get("http://localhost:5000/transfers", {
        headers: {
          "Allow-Cross-Origin-Access": "*",
          Authorization: "Bearer " + localStorage.getItem("auth"),
        },
      })
        .then((res) => {
          console.log("update");
          localStorage.setItem("transfers", JSON.stringify(res.data));
          this.setState({
            transfers: res.data,
          });
        })
        .catch((err) => console.log(err));
    }
  }
  itemTemplate(transfer, layout) {
    return <TransferCard transfer={transfer} />;
  }
  queryTransfers(filters) {
    get("http://localhost:5000/transfers", {
      params: filters,
      headers: {
        "Allow-Cross-Origin-Access": "*",
        Authorization: "Bearer " + localStorage.getItem("auth"),
      },
    })
      .then((res) => {
        console.log("update", JSON.stringify(res.data, null, 2));
        localStorage.setItem("transfers", JSON.stringify(res.data));
        this.setState({
          transfers: res.data,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="transfers-container">
        <div>
          <TransferFilters
            onQuery={(filters) => {
              this.queryTransfers(filters);
            }}
          ></TransferFilters>
        </div>
        <div className="transfers-data-wrapper">
          <SimpleBar
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              paddingRight: "10px",
              paddingLeft: "5px",
            }}
          >
            {this.state.transfers
              .reverse()
              .map((transfer) => this.itemTemplate(transfer))}
          </SimpleBar>
        </div>
      </div>
    );
  }
}
