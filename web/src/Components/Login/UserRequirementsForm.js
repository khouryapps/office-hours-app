import React, { Component } from "react";
import { Layout, Card, List, Table, Form, Switch, Button, Modal, Input, Alert, InputNumber, Radio, Select, Menu, Dropdown, Icon, Tooltip, Checkbox, Divider, Popconfirm, message } from 'antd/lib/index';

import AppComponent from '../AppComponent';
import LoginLayout from './LoginLayout';

const { Header, Content } = Layout;

const FormItem = Form.Item;

const UserRequirementsForm = Form.create({ name: 'Required User Data' })(
  class extends AppComponent {

    state = {
      nuid: null,
      campus: null,
    }

    validateForm() {
      const { user } = this.props;
      const { nuid, campus } = this.state;
      return (user.nuid || (nuid >= 1 && nuid <= 999999999)) && (user.campuses.length > 0 || campus);
    }

    render () {
      const { form, handle_userrequirements, campus_list, user } = this.props;
      const { getFieldDecorator } = form;
      const { nuid, campus } = this.state;
      const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, }, colon: true };

      const missing = user.nuid ? "campus" : user.campuses.length > 0 ? "NUID" : "NUID and campus";

      return (
        <LoginLayout {...this.props}>
          <Card title="One Time Action Required" style={{ width: "40" }}>
            <Divider orientation="left">Please provide your { missing }</Divider>
            <p>Please enter your { missing } so that we can customize the site for you.  Once this form is submitted, you will not be able to edit it again without <a href="mailto:khoury-admin@ccs.neu.edu">contacting the Khoury Admin Site administrators</a>.</p>
            <Form>
              { user.nuid ? null :
                <FormItem {...formItemLayout} className="login-left" label="NUID" extra={ ['Your 9-digit NUID can be found on ', <a key="link" target="_blank" href="https://my.northeastern.edu">My.Northeastern</a>, "." ] }>
                  {getFieldDecorator('nuid', {
                    rules: [{ required: true, message: ['Your 9-digit NUID can be found on', <a key="link" target="_blank" href="https://my.northeastern.edu">My.Northeastern</a> ]}],
                    initialValue: user.nuid,
                    onChange: event => this.setState({ nuid: event }),
                  })(<InputNumber style={{ width: 180 }} min={0} max={ 999999999 } step={1} ref={ (input) => input && input.focus() } />)}
                </FormItem>
              }
              { user.campuses.length > 0 ? null :
                <FormItem {...formItemLayout} className="login-left" label="Campus" extra="Please select the Khoury campus that you are most closely associated with.">
                  {getFieldDecorator('campus', {
                    rules: [{ required: true, message: 'Please enter the campus you are located at.'}],
                    initialValue: user.campuses.length > 0 ? user.campuses[0] : null,
                    onChange: event => this.setState({ campus: event }),
                  })(<Select style={{ width: 180 }} >
                    { Object.values(campus_list).filter(el => el.name != "Online").map(el => <Select.Option key={ el.id } value={ el.id }>{ el.name }</Select.Option> ) }
                    </Select>)}
                </FormItem>
              }
              <FormItem>
                { this.validateForm() ? (
                  <Popconfirm icon={ <Icon type="question-circle-o" /> } placement="bottom" title={ "Are you sure the "  + missing + " that you entered is correct?    You will not be able to change it without contacting the administrators." } onConfirm={ () => handle_userrequirements(this.state) } okText="Yes" cancelText="No">
                    <Button type="primary">Submit</Button>
                  </Popconfirm>
                ) : (
                  <Button type="primary" disabled={ true }>Submit</Button>
                ) }
              </FormItem>
            </Form>
          </Card>
        </LoginLayout>
      );
    }
  }
);

export default UserRequirementsForm;
