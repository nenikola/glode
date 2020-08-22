import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./TransferDetails.css";
import SimpleBar from "simplebar-react";
import { get } from "axios";

export default class TransferDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transfer: JSON.parse(localStorage.getItem("transfers")).find(
        (transfer) => transfer.bookingNumber === this.props.match.params.id
      ),
      te: undefined,
      teEvents: undefined,
      map: undefined,
    };
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmVuaWtvbGEiLCJhIjoiY2p4ZDhzd2F1MDd6ZDN6b3ZubGt0aGozMCJ9.P1ZFsEVmiXr7OKZvopWsow";
  }
  componentDidMount() {
    if (this.state.transfer) {
      get(
        `http://localhost:5000/te/?tspID=${this.state.transfer.transportServiceProviderID}&bookingNumber=${this.state.transfer.bookingNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      ).then((res) => {
        // alert(JSON.stringify(res.data[0].events, null, 2));
        // return Promise.all(res.data[0].events.filter((event) => event.eventLocation.geoCoordinates==undefined).map((event) => get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${}%20Belgrade%20Nik%C5%A1i%C4%87ka%2046.json?country=rs&access_token=pk.eyJ1IjoibmVuaWtvbGEiLCJhIjoiY2p4ZDhzd2F1MDd6ZDN6b3ZubGt0aGozMCJ9.P1ZFsEVmiXr7OKZvopWsow`));
        this.setState((prev) => ({
          ...prev,
          te: res.data[0],
          teEvents: res.data[0].events.filter(
            (event) => event.eventLocation.geoCoordinates
          ),
        }));
      });
    }

    let map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        this.state.transfer.transferData.originLocation.geoCoordinates.lon -
          (this.state.transfer.transferData.destinationLocation.geoCoordinates
            ? this.state.transfer.transferData.destinationLocation
                .geoCoordinates.lon
            : 0),
        this.state.transfer.transferData.originLocation.geoCoordinates.lat,
      ],
      zoom: 4,
    });
    map.on("load", () => {
      var originLocationMarker = new mapboxgl.Marker({ color: "lightseagreen" })
        .setLngLat([
          this.state.transfer.transferData.originLocation.geoCoordinates.lon,
          this.state.transfer.transferData.originLocation.geoCoordinates.lat,
        ])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div>
              <h4>Origin location:</h4>
              <p>${this.state.transfer.transferData.originLocation.address.address}</p>
              <p>${this.state.transfer.transferData.originLocation.address.city}</p>
              <p>${this.state.transfer.transferData.originLocation.address.country}</p>
          </div>`
          )
        )
        .addTo(map);
      if (this.state.transfer.transferData.destinationLocation.geoCoordinates) {
        var destinationLocationMarker = new mapboxgl.Marker({
          color: "lightseagreen",
        })
          .setLngLat([
            this.state.transfer.transferData.destinationLocation.geoCoordinates
              .lon,
            this.state.transfer.transferData.destinationLocation.geoCoordinates
              .lat,
          ])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div>
                    <h4>Destination location:</h4>
                    <p>${this.state.transfer.transferData.destinationLocation.address.address}</p>
                    <p>${this.state.transfer.transferData.destinationLocation.address.city}</p>
                    <p>${this.state.transfer.transferData.destinationLocation.address.country}</p>
                </div>`
            )
          )
          .addTo(map);
      }
      //TODO - replace with real data
      // const a = () => {
      //   this.setState((prev) => ({ ...prev, teEvents: [1, 2, 3, 4, 5] }));
      // };
      // setTimeout(() => {
      //   a();
      // }, 3000);
      this.setState((prevState) => ({
        ...prevState,
        map,
      }));
    });
  }
  // https://api.mapbox.com/geocoding/v5/mapbox.places/Serbia%20Belgrade%20Nik%C5%A1i%C4%87ka%2046.json?country=rs&access_token=pk.eyJ1IjoibmVuaWtvbGEiLCJhIjoiY2p4ZDhzd2F1MDd6ZDN6b3ZubGt0aGozMCJ9.P1ZFsEVmiXr7OKZvopWsow
  render() {
    if (this.state.teEvents) {
      this.state.teEvents.map((e) => {
        const marker = new mapboxgl.Marker({
          color:
            JSON.stringify(this.state.te.currentLocation) ===
            JSON.stringify(e.eventLocation)
              ? "coral"
              : "lightseagreen",
          scale: 0.8,
        })
          .setLngLat([
            e.eventLocation.geoCoordinates.lon,
            e.eventLocation.geoCoordinates.lat,
          ])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div>
                        <h4>Event:</h4>
                        <p>id: ${e.eventID}</p>
                        <p>${e.transferEquipmentEventType}</p>
                    </div>`
            )
          );
        if (this.state.map) {
          marker.addTo(this.state.map);
        }
      });
    }
    return (
      <div className="transfer-details">
        <div className="toolbar">
          <button
            onClick={(e) => {
              this.props.history.goBack();
            }}
          >
            {"<"}
          </button>
        </div>
        <div className="transfer-data"></div>
        <div className="locations">
          <div className="info">
            <div className="destination-origin">
              <div className="info-data">
                <div>
                  <h4>Origin location:</h4>
                  <p>
                    {
                      this.state.transfer.transferData.originLocation.address
                        .address
                    }
                  </p>
                  <p>
                    {
                      this.state.transfer.transferData.originLocation.address
                        .city
                    }
                    {" - "}
                    {
                      this.state.transfer.transferData.originLocation.address
                        .country
                    }
                  </p>
                </div>
              </div>
              <div className="info-data">
                <div>
                  <h4>Destination location:</h4>
                  <p>
                    {
                      this.state.transfer.transferData.destinationLocation
                        .address.address
                    }
                  </p>
                  <p>
                    {
                      this.state.transfer.transferData.destinationLocation
                        .address.city
                    }
                    {" - "}
                    {
                      this.state.transfer.transferData.destinationLocation
                        .address.country
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="te-events">
              <SimpleBar style={{ width: "100%", height: "100%" }}>
                {this.state.teEvents ? (
                  this.state.teEvents.map((e, i) => {
                    return (
                      <div
                        key={i}
                        className="info-data"
                        // onClick={() => {
                        //   marker.togglePopup();
                        // }}
                      >
                        <div>
                          {JSON.stringify(this.state.te.currentLocation) ===
                          JSON.stringify(e.eventLocation) ? (
                            <div
                              style={{
                                position: "absolute",
                                right: "5%",
                                display: "inline-block",
                                backgroundColor: "coral",
                                borderRadius: "10px",
                                fontSize: 8,
                                padding: "2px 6px",
                              }}
                            >
                              CURRENT LOCATION
                            </div>
                          ) : (
                            ""
                          )}
                          <h4>Event :</h4>
                          <p>
                            {e.eventLocation.address
                              ? e.eventLocation.address.address
                              : ""}
                          </p>
                          <p>
                            {e.eventLocation.address
                              ? e.eventLocation.address.city
                              : ""}
                            {" - "}
                            {e.eventLocation.address
                              ? e.eventLocation.address.country
                              : ""}
                            {"  "}[{e.eventLocation.unlocode || ""}]
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    className={
                      this.state.map
                        ? "loading-circle"
                        : "loading-circle active"
                    }
                  >
                    <div className="loader">Loading...</div>
                  </div>
                )}
              </SimpleBar>
            </div>
          </div>
          <div className="map-wrapper">
            <div
              className={
                this.state.map ? "loading-circle" : "loading-circle active"
              }
            >
              <div className="loader">Loading...</div>
            </div>
            <div
              ref={(el) => (this.mapContainer = el)}
              className="mapContainer"
            />
          </div>
        </div>
      </div>
    );
  }
}
