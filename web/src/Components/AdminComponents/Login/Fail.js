import React, { Component } from "react";
import { Layout, Card, List, Table, Form, Switch, Button, Modal, Input, Alert, InputNumber, Radio, Select, Menu, Dropdown, Icon, Tooltip, Checkbox, Divider, Popconfirm, message } from 'antd';

import AppComponent from '../AppComponent';
import LoginLayout from './LoginLayout';

const { Header, Content } = Layout;

class CannotImpersonate extends AppComponent {
  render () {
    const { form, handle_userrequirements, campus_list, user, has_nuid, stop_impersonate, has_campus } = this.props;
    console.log(has_nuid, has_campus);
    return (
      <LoginLayout {...this.props}>
        <Card title="Unable to Impersonate this user" style={{ width: "40" }}>
          <Button type="primary" onClick={stop_impersonate}>Back to Safety</Button>
        </Card>
      </LoginLayout>
    );
  }
}


class NoGroups extends AppComponent {
  render () {
    const { form, handle_userrequirements, campus_list, user } = this.props;

    return (
      <LoginLayout {...this.props}>
        <Card title="Unable to Identify Groups" style={{ width: "40" }}>
          <p>We are able to authenticate your login, but we are unable to determine what kind of user account you have based on your groups.  You will need to contact <a href="https://my.ccs.neu.edu/session/login">Khoury Systems</a> in order to fix this error.  Please see more details below depending on what kind of account you have.</p>
          <p><i>Students:</i> If you are a student, your account should be automatically provisioned and you should be in the <tt>students</tt> group.  If you have a "sponsored" account because you are not a Khoury student, you may need to contact <a href="https://my.ccs.neu.edu/session/login">Khoury Systems</a> to ask whether your account is in the <tt>guests</tt> group.</p>
          <p><i>Faculty:</i> If you are a faculty member, your account should be in the <tt>faculty</tt> group.  You should email <a href="mailto:systems@ccs.neu.edu">Khoury Systems</a> to ask whether your account is in the <tt>faculty</tt> group.</p>
          <p><i>Staff:</i> If you are a faculty member, your account should be in the <tt>ccsstaff</tt> group.  You should email <a href="mailto:systems@ccs.neu.edu">Khoury Systems</a> to ask whether your account is in the <tt>ccsstaff</tt> group.</p>
        </Card>
      </LoginLayout>
    );
  }
}

class NoInstructor extends AppComponent {
  render () {
    const { form, handle_userrequirements, campus_list, user } = this.props;

    return (
      <LoginLayout {...this.props}>
        <Card title="Unable to Link Faculty Account" style={{ width: "40" }}>
          <p>We are able to authenticate your login as a faculty member, but we are unable to find a matching instructor record for you.  You will need to contact <a href="mailto:khoury-admin@ccs.neu.edu">the Khoury Admin Site administrators</a> and include your NUID, campus, and position description.  We apoligize for the inconvenience.</p>
        </Card>
      </LoginLayout>
    );
  }
}

export {CannotImpersonate, NoGroups, NoInstructor };
