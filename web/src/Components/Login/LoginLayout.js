import React, { Component } from "react";
import { Layout, Card, List, Table, Form, Switch, Button, Modal, Input, Alert, InputNumber, Radio, Select, Menu, Dropdown, Icon, Tooltip, Checkbox, Divider, message } from 'antd/lib/index';
const { Header, Content } = Layout;

class LoginLayout extends Component {

  render() {
    const { backgroundImage } = this.props;

    var warning = [];
    if (window.location.hostname != "admin.khoury.northeastern.edu") {
      warning.push(<Alert key="alert" message="This is not the real site" description="This is a development site.  All entered data will be ignored." type="warning" style={{ textAlign: "left", marginBottom: "16px" }} showIcon />);
    }
    warning = warning.concat(this.props.children);

    const chars = [
      { content: null },
      { content: warning },
      { content: null }
    ];

    const padding = "50px";

    return (
      <Layout className="login-background" style={{ backgroundImage }}>
        <Content className="login" style={{ paddingTop: padding }}>
          <br />
          <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 3, xl: 3, xxl: 3, }}
            dataSource={ chars }
            renderItem={item => ( <List.Item>{ item.content ? item.content : "" }</List.Item> )}
            />
        </Content>
      </Layout>
    );
  }
}

export default LoginLayout;
