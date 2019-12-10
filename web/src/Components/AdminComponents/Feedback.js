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

const FeedbackForm = Form.create({ name: 'form_in_modal' })(
  class extends AppComponent {

    render() {
      const { visible, onCancel, onCreate, form} = this.props;
      const { getFieldDecorator } = form;

      const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, }, colon: true };

      return (
        <Modal
          visible={visible}
          title={ "Provide some Feedback" }
          okText={ "Save" }
          onCancel={ () => { onCancel();  } }
          onOk={ () => { onCreate();  } }
          width={800}
        >
        <Form onSubmit={ this.handleSubmit } >
        <FormItem {...formItemLayout} label="Type" extra="Please select the type of feedback.">
          {getFieldDecorator('label', {
            rules: [{ required: true, message: 'Please select a type.' }],
            initialValue: "",
          })(<Select showSearch style={{ width: 360 }} filterOption={ this.filter } >
            { ["Feedback", "Bug", "Feature"].map((el) => <Option key={ el } value={ el }>{ el }</Option> ) }
          </Select>
          )}
        </FormItem>
          <FormItem {...formItemLayout} label="Summary" extra="Please provide a title.">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input a summary.' }],
              initialValue: "",
            })(<Input style={{ width: 360 }} /> )}
          </FormItem>
          <FormItem {...formItemLayout} label="Extra" extra="Please provide any extra details. ">
            {getFieldDecorator('notes', {
              rules: [{ required: true, message: 'Please input extra details.' }],
              initialValue: "",
            })(<TextArea style={{ width: 360 }} rows={4} /> )}
          </FormItem>
        </Form>
        </Modal>
      );
    }
  }
);


class Feedback extends AppComponent {
  state = {
      modal_visible: false,
      endpoint: "/api/app_feedback/",
    };

  handleCreateUpdate = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) { return; }

      this.setState({ modal_visible: false });

        this.doPost(this.state.endpoint, () => { message.success("Submitted Feedback."); form.resetFields(); }, JSON.stringify({title: values.title, label: values.label, notes: values.notes, version: this.props.version, groups: this.props.user.groups.map(el => el.name).join(", "), platform: navigator.platform, browser: navigator.appName + " " + navigator.appVersion }));
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  
  render() {
    return (
      <React.Fragment>
        <Button type="default" onClick={ () => this.setState({ modal_visible: true }) }><Icon type="form" />Provide Feedback</Button>
              <FeedbackForm
                {...this.props}
                wrappedComponentRef={ this.saveFormRef }
                visible={ this.state.modal_visible }
                onCancel={ () => this.setState({ modal_visible: false }) }
                onCreate={this.handleCreateUpdate}
              />
      </React.Fragment>        
    );
  }
}

export { Feedback };