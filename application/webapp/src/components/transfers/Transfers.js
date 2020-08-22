import React, { Component } from "react";
import { DataScroller } from "primereact/datascroller";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { get } from "axios";
import "./Transfers.css";
import TransferCard from "./transferCard/TransferCard";
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
      get(
        "http://localhost:5000/transfers?orgID=" + localStorage.getItem("org"),
        {
          headers: {
            "Allow-Cross-Origin-Access": "*",
            Authorization: "Bearer " + localStorage.getItem("auth"),
          },
        }
      )
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
    // return <div>{JSON.stringify(transfer)}</div>;
  }

  render() {
    return (
      <div className="transfers-container">
        <div>Filters</div>
        <div className="transfers-data-wrapper">
          <SimpleBar style={{ maxHeight: "100%", paddingRight: "10px" }}>
            <DataScroller
              value={[...this.state.transfers].reverse()}
              rows={this.state.transfers.length}
              itemTemplate={this.itemTemplate}
            ></DataScroller>
          </SimpleBar>
        </div>
      </div>
    );
  }
}
