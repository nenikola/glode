import React, { Component } from "react";
import { InputText } from "primereact/inputtext/";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import "primeicons/primeicons.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "./Login.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      city: "",
    };
  }
  render() {
    return (
      <div className="login">
        {/* <div className="filter"></div> */}
        <div className="login-logo">
          <h1 className="unselectable">
            <p style={{ display: "inline", color: "#47b6b1" }}>G</p>LODE
          </h1>
          <h4 className="unselectable">
            GLOBAL{" "}
            <p style={{ display: "inline", color: "#47b6b1" }}>BLOCKCHAIN</p>{" "}
            TRANSPORT MANAGEMENT SYSTEM
          </h4>
        </div>
        <div className="login-container">
          <div className="login-fields">
            <div className="fieldWrapper">
              <span className="p-float-label">
                <InputText
                  className="field"
                  id="input-float-username"
                  value={this.state.username}
                  onChange={(e) => this.setState({ username: e.target.value })}
                />
                <label htmlFor="input-float-username">Username</label>
              </span>
            </div>
            <div className="fieldWrapper">
              <span className="p-float-label">
                <Password
                  className="field"
                  id="input-float-password"
                  value={this.state.value}
                  feedback={false}
                  onChange={(e) => this.setState({ value: e.target.value })}
                />
                <label htmlFor="input-float-password">Password</label>
              </span>
            </div>
            <div className="fieldWrapper">
              <Dropdown
                className="field"
                placeholder="Organization"
                value={this.state.city}
                required="true"
                options={[
                  { label: "Ocean Carrier A", value: "ocA" },
                  { label: "Ocean Carrier B", value: "ocB" },
                  { label: "Inland Transporter A", value: "itA" },
                  { label: "Inland Transporter B", value: "itB" },
                  { label: "Fright Forwarder A", value: "ffA" },
                ]}
                onChange={(e) => this.setState({ city: e.value })}
              />
            </div>
          </div>
          <div
            style={{
              width: "30%",
              height: "80%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Button
              style={{
                width: "70%",
              }}
              label="LOGIN"
              icon="pi pi-angle-right"
              iconPos="right"
            ></Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
