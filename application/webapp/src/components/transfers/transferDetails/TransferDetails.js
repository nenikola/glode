import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./TransferDetails.css";
import SimpleBar from "simplebar-react";
export default class TransferDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transfer: JSON.parse(localStorage.getItem("transfers")).find(
        (transfer) => transfer.bookingNumber === this.props.match.params.id
      ),
      teEvents: undefined,
      map: undefined,
    };
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmVuaWtvbGEiLCJhIjoiY2p4ZDhzd2F1MDd6ZDN6b3ZubGt0aGozMCJ9.P1ZFsEVmiXr7OKZvopWsow";
  }
  componentDidMount() {
    let map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        this.state.transfer.transferData.originLocation.geoCoordinates.lon -
          this.state.transfer.transferData.destinationLocation.geoCoordinates
            .lon,
        this.state.transfer.transferData.originLocation.geoCoordinates.lat,
      ],
      zoom: 4,
    });
    map.on("load", () => {
      var marker = new mapboxgl.Marker({ color: "lightseagreen" })
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
      var marker1 = new mapboxgl.Marker({ color: "lightseagreen" })
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
      //TODO - replace with real data
      const a = () => {
        this.setState((prev) => ({ ...prev, teEvents: [1, 2, 3, 4, 5] }));
      };
      setTimeout(() => {
        a();
      }, 3000);
      this.setState((prevState) => ({
        ...prevState,
        map,
      }));
    });
  }
  render() {
    if (this.state.teEvents) {
      this.state.teEvents.map((e) => {
        const marker = new mapboxgl.Marker({
          color: "lightseagreen",
        })
          .setLngLat([
            this.state.transfer.transferData.destinationLocation.geoCoordinates
              .lon +
              e * 2,
            this.state.transfer.transferData.destinationLocation.geoCoordinates
              .lat -
              e * 1,
          ])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div>
                        <h4>Event ${e}:</h4>
                        <p>${this.state.transfer.transferData.destinationLocation.address.address}</p>
                        <p>${this.state.transfer.transferData.destinationLocation.address.city}</p>
                        <p>${this.state.transfer.transferData.destinationLocation.address.country}</p>
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
                {[1, 2, 3, 4, 5].map((e) => {
                  return (
                    <div
                      className="info-data"
                      // onClick={() => {
                      //   marker.togglePopup();
                      // }}
                    >
                      <div>
                        <h4>Event :</h4>
                        <p>
                          {
                            this.state.transfer.transferData.originLocation
                              .address.address
                          }
                        </p>
                        <p>
                          {
                            this.state.transfer.transferData.originLocation
                              .address.city
                          }
                          {" - "}
                          {
                            this.state.transfer.transferData.originLocation
                              .address.country
                          }
                        </p>
                      </div>
                    </div>
                  );
                })}
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
