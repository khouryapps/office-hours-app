import React, { Component } from "react";
import { Layout, Card, List, Table, Form, Switch, Button, Modal, Input, Alert, InputNumber, Radio, Select, Menu, Dropdown, Icon, Tooltip, Checkbox, Divider, message } from 'antd/lib/index';
import LoginLayout from './LoginLayout';

const { Header, Content } = Layout;

const FormItem = Form.Item;


const Login = Form.create({ name: 'login' })(
  class extends Component {

    state = {
      login_username: "",
      login_password: "",
      login_remember: false,
      login_code: "",
    };

    validateForm() {
      const { need_2fa } = this.props;
      const { login_username, login_password, login_code } = this.state;
      return login_username.length > 0 && login_password.length > 0 && (!need_2fa || login_code);
    }

    handleChange = event => {
      this.setState({
        [event.target.id]: event.target.id == "login_username" ? (event.target.value).toLowerCase() : event.target.value
      });
    }

    render() {
      const { form, handle_login, login_error, need_2fa, error_2fa } = this.props;
      const { getFieldDecorator } = form;
      const { login_username, login_password, login_code, login_remember } = this.state;
      const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, }, colon: true };

      return (
        <LoginLayout {...this.props}>
          <Card title="Khoury Administration Site" style={{ width: "40" }}>
            <p>Welcome to the Khoury College Administration site; please use the login form below.  You should use your Khoury College account, <i>not</i> your My.Northeastern account.</p>

            { login_error ? ( <Alert message={ login_error + " If you're having trouble logging in, or need to request an account, please visit https://my.ccs.neu.edu" } type="error" showIcon /> ) : "" }

            { error_2fa ? ( <Alert message={ "Error from server: " + error_2fa } type="error" showIcon /> ) : "" }

            <Divider orientation="left">{ need_2fa ? "Two Factor Authentication Code" : "Login Form" }</Divider>

            { need_2fa ? <p>Please enter the code from your generator below.</p> : null }

            <Form onSubmit={e => handle_login(e, this.state)}>
              <FormItem {...formItemLayout} label="Username" style={{ display: need_2fa ? "none" : "block" }}>
                {getFieldDecorator('username', {
                  initialValue: login_username,
                  onChange: this.handleChange,
                })(<Input style={{ width: "40" }} ref={ (input) => input && input.focus() }/>)}
              </FormItem>
              <FormItem {...formItemLayout} label="Password" style={{ display: need_2fa ? "none" : "block" }}>
                {getFieldDecorator('password', {
                  initialValue: login_password,
                  onChange: this.handleChange,
                })(<Input type="password" style={{ width: "100%" }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="Remember me" style={{ display: need_2fa ? "none" : "block" }}>
              {getFieldDecorator('remember', {
                initialValue: false,
                valuePropName: 'checked',
                onChange: (event) => { this.setState({ login_remember: event.target.checked }) },
              })(<Checkbox style={{ float: "left" }}></Checkbox>)}
              </FormItem>
              { login_remember ? 
                <FormItem {...formItemLayout} label=" " colon={ false } style={{ display: need_2fa ? "none" : "block" }}>
                  <Alert message={ "Note that you should only select Remember Me on devices that are your own (i.e., not on public or shared devices)." } type="warning" showIcon />
                </FormItem> : null }
              <FormItem {...formItemLayout} label="2FA Code" style={{ display: need_2fa ? "block" : "none" }}>
                {getFieldDecorator('code', {
                  initialValue: login_code,
                  onChange: (e) => this.setState({ login_code: e }),
                })(<InputNumber size="large"  min={0} max={999999} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" disabled={!this.validateForm()}>
                  <Icon type="login" /> { need_2fa ? "Submit" : "Log in" }
                </Button>
              </FormItem>
            </Form>
          </Card>
        </LoginLayout>
       );
    }
  }
);

export default Login;
