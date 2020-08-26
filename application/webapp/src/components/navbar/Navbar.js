import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
export default function Navbar(props) {
  return (
    <div
      style={
        {
          // width: props.width,
          // height: props.height,
        }
      }
      className="navbar-container"
    >
      <div className="navbar">
        <ul className="navbar-list">
          <li className="navbar-listItem unselectable">
            <Link to="/">DASHBOARD</Link>
            <hr></hr>
          </li>
          <li className="navbar-listItem unselectable">
            <Link to="/bookings">BOOKINGS</Link>
            <hr></hr>
          </li>
          <li className="navbar-listItem unselectable">
            <Link to="/transfers">TRANSFERS</Link>
            <hr></hr>
          </li>
        </ul>
      </div>
    </div>
  );
}
