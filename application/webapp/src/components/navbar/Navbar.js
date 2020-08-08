import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
export default function Navbar(props) {
  return (
    <div
      style={{
        width: props.width,
        height: props.height,
      }}
      className="navbar-container"
    >
      <div className="navbar">
        <ul className="navbar-list">
          <li className="navbar-listItem unselectable">
            <Link to="/">DASHBOARD</Link>
          </li>
          <li className="navbar-listItem unselectable">
            <Link to="/bookings">BOOKINGS</Link>
          </li>
          <li className="navbar-listItem unselectable">
            <Link to="/transfers">TRANSFERS</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
