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
import { post } from "axios";
import { Redirect } from "react-router-dom";
import { ExistingOrganizations } from "app-shared-library";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      organization: "",
    };
  }
  render() {
    if (localStorage.getItem("auth")) {
      return <Redirect to="/" />;
    }
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
                  value={this.state.password}
                  feedback={false}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
                <label htmlFor="input-float-password">Password</label>
              </span>
            </div>
            <div className="fieldWrapper">
              <div className="dropdown-wrapper">
                <Dropdown
                  showClear={true}
                  className="dropdown"
                  value={this.state.organization}
                  optionLabel={"organizationName"}
                  options={[
                    ExistingOrganizations.OCA,
                    ExistingOrganizations.OCB,
                    ExistingOrganizations.ITA,
                    ExistingOrganizations.ITB,
                    ExistingOrganizations.FFA,
                  ]}
                  onChange={(e) => {
                    console.log(e.value);
                    this.setState({
                      organization: e.value,
                    });
                  }}
                  placeholder="Select an organization"
                />
              </div>
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
              onClick={async (e) => {
                const res = await post("http://localhost:5000/auth/login/", {
                  username: this.state.username,
                  password: this.state.password,
                  orgID: this.state.organization.organizationID,
                });
                console.log(JSON.stringify(res.data["access_token"]));
                localStorage.setItem("auth", res.data["access_token"]);
                localStorage.setItem("user", this.state.username);
                localStorage.setItem(
                  "org",
                  this.state.organization.organizationID
                );
                localStorage.setItem(
                  "orgName",
                  this.state.organization.organizationName
                );
                this.setState({ ...this.state, auth: true });
              }}
            ></Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
