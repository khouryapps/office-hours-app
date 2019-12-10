import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import queryString from "query-string";
import key from "weak-key/index";

import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Table,
  Tag,
  Tooltip,
  Spin,
  Divider,
  message
} from "antd/lib/index";
const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

class LoggedInComponent extends Component {
  controller = new AbortController();

  componentWillUnmount() {
    this.cancelRequests();
  }

  cancelRequests() {
    this.controller.abort();
    this.controller = new AbortController();
  }

  getAuthorizationHeader = () => {
    return "Token 181287ecb4cf53c1fb678ccbc7840694b99951e8";
    // return "Token " + this.props.token;
  };

  doFetch = (
    method,
    endpoint,
    headers,
    body,
    expected_code,
    expected_content_type,
    func
  ) => {
    console.log("do fetch\n")
    console.log("\nmethod: ", method)
    console.log("\mendpoint: ", endpoint)
    headers["Authorization"] = this.getAuthorizationHeader();
    console.log("\mAuthorization: ", headers["Authorization"])

    fetch(endpoint, {
      headers: headers,
      method: method,
      body: body,
      signal: this.controller.signal
    })
      .then(response => {
        if (response.status !== 200 && response.status !== expected_code) {
          message.error(
            "Got response code " +
              response.status +
              " loading from " +
              endpoint +
              "."
          );
          if (response.status == 401) {
            this.props.logged_out();
          } else {
            this.doPost(
              "/api/error/",
              () => null,
              JSON.stringify({
                version: this.props.version,
                trace: response.status + " " + response.statusText,
                url: endpoint,
                groups: this.props.user
                  ? this.props.user.groups.map(el => el.name).join(", ")
                  : "",
                notes: "",
                platform: navigator.platform,
                browser: navigator.appName + " " + navigator.appVersion
              })
            );
          }
        } else if (
          response.headers.get("Content-Type") != expected_content_type
        ) {
          message.error(
            "Got response of unexpected content type " +
              response.headers.get("Content-Type") +
              " loading from " +
              endpoint +
              "."
          );
          return null;
        } else if (expected_content_type == "application/json") {
          return response.json();
        } else if (expected_code == 204 && method == "DELETE") {
          message.success("Deleted Item");
          return null;
        } else if (
          response.headers.get("Content-Type") != expected_content_type
        ) {
          message.error(
            "Got response of unexpected content type " +
              response.headers.get("Content-Type") +
              " loading from " +
              endpoint +
              "."
          );
          return null;
        } else if (expected_content_type == "application/json") {
          return response.json();
        } else {
          return response.blob();
        }
      })
      .then(func, error => {
        if (!(error instanceof DOMException && error.name == "AbortError")) {
          message.error("Caught error: " + error);
        }
      });
  };

  doGet = (endpoint, func) => {
    this.doFetch("GET", endpoint, {}, null, 200, "application/json", func);
  };

  doPost = (endpoint, func, body) => {
    this.doPostContentType(endpoint, func, body, "application/json");
  };

  doPatch = (endpoint, func, body) => {
    this.doPatchContentType(endpoint, func, body, "application/json");
  };

  doDelete = (endpoint, func, body) => {
    this.doDeleteContentType(endpoint, func, body, "application/json");
  };

  doPostContentType = (endpoint, func, body, type) => {
    this.doFetch(
      "POST",
      endpoint,
      { "Content-Type": type },
      body,
      201,
      "application/json",
      func
    );
  };

  doPatchContentType = (endpoint, func, body, type) => {
    this.doFetch(
      "PATCH",
      endpoint,
      { "Content-Type": type },
      body,
      200,
      "application/json",
      func
    );
  };

  doDeleteContentType = (endpoint, func, body, type) => {
    this.doFetch(
      "DELETE",
      endpoint,
      { "Content-Type": type },
      body,
      204,
      "application/json",
      func
    );
  };

  openPDF = path => {
    this.doFetch("GET", path, {}, null, 200, "application/pdf", data => {
      const file = new Blob([data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Open new windows and show PDF
      window.open(fileURL);
    });
  };
}

export default LoggedInComponent;
