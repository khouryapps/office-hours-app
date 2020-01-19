import React, { Component } from "react";
import { Link } from "react-router-dom";
import Markdown from 'react-markdown';
import AppComponent from './AppComponent';
import { add_dividers, format_percent, format_decimal, add_brs, if_empty } from './Utils';

import { PageHeader, Table, Form, Switch, Card, List, Layout, Tooltip, Icon, Menu, Dropdown, Spin, Calendar, Divider, Col, Statistic, Row, Badge, Select, Breadcrumb, message } from 'antd/lib/index';
const FormItem = Form.Item;
const Option = Select.Option;

class Content extends AppComponent {

  componentDidMount() {
    document.title = "Khoury Admin — " + (this.props.page_title ? this.props.page_title : this.props.title);
  }

  render() {
    const { title, breadcrumbs } = this.props;

    return (
      <Layout.Content>
        <Breadcrumb>
          { breadcrumbs.map(el => <Breadcrumb.Item key={ el.text }>{ el.link ? <Link to={ this.getLink(el.link) }>{ el.text }</Link> : el.text }</Breadcrumb.Item>) }
        </Breadcrumb>
        <PageHeader title={ title } />
        {this.props.children}
      </Layout.Content>
    );
  }
}

export default Content;