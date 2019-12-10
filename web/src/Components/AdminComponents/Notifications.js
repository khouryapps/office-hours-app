import React, { Component } from "react";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import Media from 'react-media';
import key from "weak-key";
import queryString from 'query-string'
import Content from './Content';

import { PageHeader, Button, Tag, Collapse, Popover, Modal, Table, Alert, Form, Switch, Card, Radio, List, Layout, Input, InputNumber, Tooltip, Icon, Menu, Dropdown, Spin, Calendar, Divider, Col, Statistic, Row, Badge, Select, Breadcrumb, Checkbox, message } from 'antd';

import AppComponent from "./AppComponent";
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const NotificationAdminForm = Form.create({ name: 'form_not_in_modal' })(
  class extends AppComponent {
    state = {
      group: null,
    }

    handleSubmit = (e) => {
      const form = this.props.form;
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.doPost("/api/notifications/group/", response => { form.resetFields();}, JSON.stringify(values));
          message.success("Sent");
        } else {
          message.error(err);
        }
      });
    }

    render() {
      const { form } = this.props;
      const { group } = this.state;
      const { getFieldDecorator } = form;
      const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, }, colon: true };
      return (
        <Form onSubmit={ this.handleSubmit } >
          <FormItem {...formItemLayout} label="Group" extra="Please select a Group you want to send the notificaton to.">
            {getFieldDecorator('group', {
              rules: [{ required: true, message: 'Please select a Group.' }],
              initialValue: "",
              onChange: e => { this.setState({ group: e })},
              })(<Select showSearch style={{ width: 360 }} filterOption={ this.filter } >
              { ["All", "Staff", "Admin", "Faculty", "Students", "TAs"].map(el => <Option key={ el.toLowerCase() } value={ el.toLowerCase() }>{ el }</Option> ) }
            </Select>
            )}
          </FormItem>
          { group == "tas" ? (
            <FormItem {...formItemLayout} label="Term" extra="Please select the Term.">
              {getFieldDecorator('term', {
                rules: [{ required: true, message: 'Please select a Term.' }],
                initialValue: "",
              })(<Select showSearch style={{ width: 360 }} filterOption={ this.filter }>
              { this.props.semesters.map(el => <Option key={ el } value={ el }>{ this.print_semester(el) }</Option> ) }
            </Select>
            )}
            </FormItem>
          ) : null }
          <FormItem {...formItemLayout} label="Severity" extra="Please select the Severity you would like use.">
            {getFieldDecorator('severity', {
              rules: [{ required: true, message: 'Please select a Severity.' }],
              initialValue: "",
            })(<Select showSearch style={{ width: 360 }} filterOption={ this.filter } >
            { ["Notice", "Standard", "Priority", "Urgent"].map(el => <Option key={ el } value={ el }>{ el }</Option> ) }
          </Select>
          )}
          </FormItem>
          <FormItem {...formItemLayout} label="Title" extra="Please provide a Title.">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input a Title.' }],
              initialValue: "",
            })(<Input style={{ width: 360 }} /> )}
          </FormItem>
          <FormItem {...formItemLayout} label="Body" extra="Please provide a Body. This will only be used in E-Mails.">
            {getFieldDecorator('body', {
              rules: [{ required: true, message: 'Please input a Body.' }],
              initialValue: "",
            })(<TextArea style={{ width: 360 }} rows={4} /> )}
          </FormItem>
          <FormItem {...formItemLayout} label="URL" extra="Please provide a URL.">
            {getFieldDecorator('url', {
              rules: [{ required: false, message: 'Please input a URL.' }],
              initialValue: "",
            })(<TextArea style={{ width: 360 }} rows={1} /> )}
          </FormItem>
          <FormItem {...formItemLayout} wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 }, }} >
            <Button type="primary" htmlType="submit">{ "Submit" }</Button>
          </FormItem>
        </Form>
      );
    }
  }
);

class NotificationAdmin extends AppComponent {
  state = {
  }

  render() {
    return (
      <Content {...this.props} title={"Notifications" } breadcrumbs={ [{ link: "/admin", text: "Admin" },{ text: "Notifications" }] }>
        <React.Fragment>
          <Divider orientation="left">Send a Notification</Divider>
            <p>Use the below form to send a notificaton to a select group of users, if you select a severity of Priority or Urgent an email will be sent as well.</p>
            <NotificationAdminForm {...this.props} />
        </React.Fragment>
      </Content>
    );
  }
}

class NotificationCenter extends AppComponent {
  state = {
    notification: [],
    deleted: 0,

    viewing: null,
  }

  componentDidMount() {
    this.update();
    setInterval(() => this.update(), 1000 * 15);
  }

  update = () => {
    const { notification } = this.state;
    if (notification == null || notification.length == 0) {
      this.doGet("/api/notifications/", data => this.setState({ notification: data == null ? null : data.filter(el => el.viewed == false).slice(0, 10) }));
    } else {
      this.doGet("/api/notifications/?created_at__gt=" + moment(notification[0].created_at).add(1, 'seconds').tz("America/New_York").format("YYYY-MM-DD+HH:mm:ss"),
                 data => this.setState({ notification: data == null ? null : data.filter(el => el.viewed == false).concat(notification) }));
    }
  }

  setNotificationViewed = (id) => {
    this.doPatch('/api/notifications/' + id + '/', () => this.setState({ deleted: this.state.deleted+1, viewing: null }), JSON.stringify({'viewed' : 1}));
  }

  getMessage = (el) => {
    return ( <div onClick={ () => this.setState({ viewing: el }) }><small>{ moment(el.created_at).fromNow() }</small> { el.url ? <Icon type="link" style={{ fontSize: '8px'}}/> : null }<br/>{ el.title }</div> );
  }

  getModal = (el) => {
    return (  <React.Fragment>
                <b>Priority:</b> { el.priority }<br />
                { el.url ? ( <React.Fragment><b>Link:</b> <Link key={ "link-" + el.id } to={ this.getLink(el.url) }>{ el.url }</Link><br /></React.Fragment> ) : null }
                <Divider orientation="left">Message Body</Divider>
                { el.body }
              </React.Fragment> );
  }

  render() {
    const { notification, deleted, viewing } = this.state;

    const toshow = notification == null ? [] : notification;

    const notificatinmenu = (
      <div>
        { toshow.length-deleted > 0 ? (
          <List itemLayout="horizontal" style={{ width: "250px" }} dataSource={ toshow } renderItem={ (el, idx) => {
            const alert = ( <Alert key={ el.id } style={{ marginBottom: idx < toshow.length-1 ? "10px" : "0px" }} message={ this.getMessage(el) } type={ el.priority == "Notice" ? "info" : el.priority == "Standard" ? "warning" : "error" } closable afterClose={ () => this.setNotificationViewed(el.id) } /> );
            return alert;
          } } />
        ) : ( <i>No new notifications.</i> ) }
      </div>
    );

    return (
      <React.Fragment>
        <Modal
          visible={viewing != null}
          title={ viewing == null ? null : viewing.title }
          footer={ <Button key="back" type="primary" onClick={ () => this.setState({ viewing: null }) }>Close</Button> }
          width={500}
        >
          { viewing == null ? null : this.getModal(viewing) }
        </Modal>
        <Popover placement="bottomRight" style={{ width: 500 }} title={ "Notifications" } content={ notificatinmenu } trigger="click" arrowPointAtCenter><Badge count={ notification ? toshow.length-deleted : "!" }><Icon type="notification" style={{ fontSize: '16px'}}/></Badge></Popover>
      </React.Fragment>
    );
  }
}

export { NotificationCenter, NotificationAdmin };
