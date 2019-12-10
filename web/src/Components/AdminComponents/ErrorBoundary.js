import React, { Component } from "react";
import AppComponent from './AppComponent';
import Content from './Content';

import { Divider } from 'antd';

class ErrorBoundary extends AppComponent {
  state = {
    endpoint: "/api/error/",
    id: null,

    error: null,
    info: null,
  };

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ error: error, info: info }, this.log_error);
    // You can also log the error to an error reporting service
  }

  log_error = () => {
    const { endpoint, error, info } = this.state;

    this.doPost(endpoint, response => { this.setState({ id: response.id }); }, JSON.stringify({ version: this.props.version, trace: error + info.componentStack, url: window.location.pathname + window.location.search, groups: this.props.user.groups.map(el => el.name).join(", "), notes: "", platform: navigator.platform, browser: navigator.appName + " " + navigator.appVersion }));
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return ( <Content {...this.props} title="Sorry, an error occurred" breadcrumbs={ [] }>
                <p>We are sorry, but the page has run into an error, which { this.state.id ? "has been recorded as error #" + this.state.id : "is being recorded" }.  The details of the error are below; if you run into this error repeatedly, please record the information below and <a href="mailto:khoury-admin@ccs.neu.edu">contact the Khoury Admin Site administrators</a> with the provided error number.</p>
                <Divider orientation="left">Error details</Divider>
                <pre style={{ color: "red" }}>{this.state.error && this.state.error.toString()}{this.state.info.componentStack }</pre>
              </Content> );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;