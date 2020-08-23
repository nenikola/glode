import React, { Component } from "react";
import "./Locations.css";
import LoadingCircle from "../../../loadingCirle/LoadingCircle";
import { get } from "axios";
import mapboxgl from "mapbox-gl";
import TransferEventInfo from "./transferEventInfo/TransferEventInfo";

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transferEquipments: undefined,
      teEvents: undefined,
      map: undefined,
      markers: undefined,
    };
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmVuaWtvbGEiLCJhIjoiY2p4ZDhzd2F1MDd6ZDN6b3ZubGt0aGozMCJ9.P1ZFsEVmiXr7OKZvopWsow";
  }

  componentDidMount() {
    if (this.props.tspID && this.props.bookingNumber) {
      get(
        `http://localhost:5000/te/?tspID=${this.props.tspID}&bookingNumber=${this.props.bookingNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      ).then((res) => {
        const transferEquipments = res.data;
        let markers =
          transferEquipments &&
          transferEquipments.map(
            (te) =>
              te.events &&
              te.events
                .filter((event) => event.eventLocation.geoCoordinates)
                .map((e) => {
                  const marker = new mapboxgl.Marker({
                    color:
                      JSON.stringify(te.currentLocation) ===
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
                      new mapboxgl.Popup({}).setHTML(
                        `<div>
                                  <h4>Event:</h4>
                                  <p>id: ${e.eventID}</p>
                                  <p>${e.transferEquipmentEventType}</p>
                              </div>`
                      )
                    );

                  return {
                    id: JSON.stringify(e),
                    marker,
                  };
                })
          );
        console.log(markers);
        markers =
          markers.length > 0 &&
          markers.reduce((array, marker) => [...array, ...marker]);
        this.setState((prev) => ({
          ...prev,
          transferEquipments,
          markers,
        }));
        this.props.onTeFetch(this.state.transferEquipments);
      });
    }
    const map = this.createMap();
    this.addOriginAndDestinationMarkers(
      map,
      this.props.originLocation,
      this.props.destinationLocation
    );
    console.log(Math.random());
  }

  render() {
    if (this.state.markers && this.state.map) {
      this.state.markers.forEach((marker, i) =>
        marker.marker.addTo(this.state.map)
      );
    }

    return (
      <div className="locations">
        <TransferEventInfo
          transferEquipments={this.state.transferEquipments}
          originLocation={this.props.originLocation}
          destinationLocation={this.props.destinationLocation}
          onTeEventClick={(id) => {
            if (this.state.markers && this.state.map) {
              const marker = this.state.markers.find(
                (marker) => marker.id === id
              );
              if (marker) marker.marker.togglePopup();
            }
          }}
        ></TransferEventInfo>
        <div className="map-wrapper">
          <LoadingCircle active={this.state.map}></LoadingCircle>
          <div
            ref={(el) => (this.mapContainer = el)}
            className="mapContainer"
          />
        </div>
      </div>
    );
  }

  createMap = () => {
    let map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        this.props.originLocation.geoCoordinates.lon -
          (this.props.destinationLocation.geoCoordinates
            ? this.props.destinationLocation.geoCoordinates.lon
            : 0),
        this.props.originLocation.geoCoordinates.lat,
      ],
      zoom: 4,
    });
    return map;
  };

  addOriginAndDestinationMarkers = (
    map,
    originLocation,
    destinationLocation
  ) => {
    map.on("load", () => {
      var originLocationMarker = new mapboxgl.Marker({ color: "lightseagreen" })
        .setLngLat([
          originLocation.geoCoordinates.lon,
          originLocation.geoCoordinates.lat,
        ])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div>
              <h4>Origin location:</h4>
              <p>${originLocation.address.address}</p>
              <p>${originLocation.address.city}</p>
              <p>${originLocation.address.country}</p>
          </div>`
          )
        )
        .addTo(map);

      if (destinationLocation.geoCoordinates) {
        var destinationLocationMarker = new mapboxgl.Marker({
          color: "lightseagreen",
        })
          .setLngLat([
            destinationLocation.geoCoordinates.lon,
            destinationLocation.geoCoordinates.lat,
          ])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div>
                    <h4>Destination location:</h4>
                    <p>${destinationLocation.address.address}</p>
                    <p>${destinationLocation.address.city}</p>
                    <p>${destinationLocation.address.country}</p>
                </div>`
            )
          )
          .addTo(map);
      }
      this.setState((prevState) => ({
        ...prevState,
        map,
      }));
    });
  };
}

export default Locations;
