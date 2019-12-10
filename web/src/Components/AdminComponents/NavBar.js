import React, { Component } from "react";
import { Link } from "react-router-dom";
import Media from 'react-media';
import key from "weak-key";
import queryString from 'query-string'
import MenuSelect from "./MenuSelect";
import { Feedback } from "./Feedback";
import AppComponent from "./AppComponent";
import { format_nuid, oxford } from "./Utils";

import { NotificationCenter } from "./Notifications";
import { Layout, Menu, Input, Alert, Icon, Popover, Button, Tooltip, Drawer, Divider, List, Badge, Modal, Select, Form } from 'antd';

const { Header } = Layout;
const Option = Select.Option;
const FormItem = Form.Item;


class NavBar extends AppComponent {
  state = {
    drawer_visible: false,

    impersonate_visible: false,
    feedback_visible: false,
    impersonate_user: null,
    
    endpoint_users: "/api/permissions/users/",
    users: [],
    loading_users: true,
  }

  componentDidMount() {
    const { user } = this.props;
    const { endpoint_users, users } = this.state;

    if (user.is_superuser) {
      this.doGet(endpoint_users, data => { data.sort((a, b) => a.last_name == b.last_name ? a.first_name.localeCompare(b.first_name) : a.last_name.localeCompare(b.last_name)); this.setState({ users: data, loading_users: false }) });
    }
  }

  get_semester_select = () => {
    return this.props.semester ? (
        <MenuSelect style={{float: 'right'}}
                    width={ 140 }
                    key="semester_select"
                    onSet={ this.props.onSetSemester }
                    selected={ this.props.semester }
                    data={ this.semester_list_grouped() } />
      ) : ( <i>Loading semesters...</i> );
  }

  get_campus_select = () => {
    return this.props.campus ? (
        <MenuSelect style={{float: 'right'}}
                    width={ 120 }
                    key="campus_select"
                    onSet={ this.props.onSetCampus }
                    selected={ this.props.campus }
                    data={ this.campus_list().filter(el => this.permission("can", "admin") || this.props.user.campuses.includes(el.id))  } />
      ) : ( <i>Loading...</i> );
  }

  get_impersonate = () => {
    const { start_impersonate } = this.props;
    const { impersonate_visible, impersonate_user, loading_users, users } = this.state;
    
    return (
      <Modal visible={impersonate_visible}
            title="Impersonate another user"
            okText="Start impersonating"
            onCancel={ () => this.setState({ impersonate_visible: false }) }
            onOk={ () => start_impersonate(impersonate_user) }
            okButtonProps={{ disabled: impersonate_user == null }}
            width={600}
          >
          <p>To begin impersonating another user, select a user from the list below.  Once you begin impersonating the user, a banner will appear at the top of the screen; click on that banner to stop impersonating them.</p>
          
          <div style={{ textAlign: "center", width: 552 }}>
            <Select showSearch style={{ width: 400 }} filterOption={ this.filter } onChange={ e => this.setState({ impersonate_user: e }) } placeholder="Type here to search" >
              { users.filter(u => u.id != this.props.user.id).map(u => <Option key={ u.id } value={ u.id }>{ u.first_name } { u.last_name } ({ u.username })</Option> ) }
            </Select>
          </div>
      </Modal>
    );
  }
  
  get_feedback = () => {
    const { feedback_visible } = this.state;
    //const { feedback_visible, impersonate_user, loading_users, users } = this.state;

    return (
      <Feedback {...this.props}/> 
    );
  }

  render() {
    const { match, group, logged_out, admin_site, enable_2fa, disable_2fa, stop_impersonate, user } = this.props;
    const selected = (window.location.pathname.split("/").length > 0 ? [window.location.pathname.split("/")[1]] : []);
    const alerts = [];
    
    const offset = () => (alerts.length * 32) + "px";
    const add_alert = (level, message, func) => alerts.push( <span onClick={ func } key={ message }><Alert style={{ position: 'fixed', top: offset(), width: '100%', zIndex: 1000 }} type={ level } message={ message } banner /></span> );
    
    if (this.is_beta()) { add_alert("warning", "This is the development site"); }
    if (this.is_local()) { add_alert("warning", "This is a local site"); }
    if (user.impersonator) { add_alert("info", "You are impersonating " + user.first_name + " " + user.last_name + ".  Click here to stop.", stop_impersonate); }

    const impersonate_disabled = user.impersonator ? "You are already impersonating someone" : !user.has_2fa ? "You must set up 2FA to impersonate others" : null;
    const admin_disabled = user.impersonator ? "Stop impersonating to use the Django admin site" : !user.has_2fa ? "You must set up 2FA to use the Django admin site" : null;

    const admin_button = ( <Button type="default" onClick={ admin_site } disabled={ impersonate_disabled != null }><Icon type="login" /> Open Admin site</Button> );
    const impersonate_button = ( <Button type="default" onClick={ () => this.setState({ impersonate_visible: true }) } disabled={ admin_disabled != null }><Icon type="usergroup-add" /> Impersonate...</Button> );
    
    const impersonate = this.get_impersonate();
    const feedback = this.get_feedback();

    const VERSION = "[AIV]{version}[/AIV]";
    const VERSION_DATE = "[AIV]{date}[/AIV]";

    const usermenu = (
      <div>
        <p><b>Username:</b> { user.username }<br/>
           <b>NUID:</b> { format_nuid(user.nuid) }<br/>
           <b>Campus:</b> { oxford(user.campuses.map(this.print_campus)) }<br/></p>
        <p><b>Build:</b> { VERSION }<br/>
           <b>Date:</b> { VERSION_DATE }<br/></p>
        { user.has_2fa ? <p><Button type="default" onClick={ disable_2fa }><Icon type="unlock" /> Disable 2FA</Button></p> : <p><Button type="default" onClick={ enable_2fa }><Icon type="lock" /> Set up 2FA</Button></p> }
        { user.is_superuser ? <p>{ admin_disabled ? <Tooltip placement="left" title={ admin_disabled }>{ admin_button }</Tooltip> : admin_button }</p> : null }
        { user.is_superuser ? <p>{ impersonate_disabled ? <Tooltip placement="left" title={ impersonate_disabled }>{ impersonate_button }</Tooltip> : impersonate_button }</p> : null }
        <p>{feedback}</p>
        <Button type="primary" onClick={ logged_out }><Icon type="logout" /> Log out</Button>
      </div>
    );

    const menu = [
      { permission: this.permission("can", "faculty"), right: false, content: "Faculty", link: this.getLink("/faculty") },
      { permission: this.permission("can", "staff"), right: false, content: "Staff", link: this.getLink("/staff") },
      { permission: this.permission("can", "students"), right: false, content: "Students", link: this.getLink("/students") },
      { permission: true, right: false, content: "Teaching", link: this.getLink("/teaching") },
      { permission: this.permission("can", "admin"), right: false, content: "Admin", link: this.getLink("/admin") },
      { permission: true, right: true, content: ( <Popover placement="bottomRight" title={ user.first_name + " "  + user.last_name } content={ usermenu } trigger="click" arrowPointAtCenter><Icon type="user" style={{ fontSize: '16px'}}/></Popover> ) },
      { permission: true, right: true, content: ( <NotificationCenter {...this.props} />) },
      { permission: true, right: true, title: "Semester", content: this.get_semester_select() },
      { permission: this.permission("can", "admin") || user.campuses.length > 1, right: true, title: "Campus", content: this.get_campus_select(user.campuses) },
    ]

    return (
      <React.Fragment>
        { impersonate }
        { feedback }
        { alerts }
        <Header className="header" style={{ position: 'fixed', zIndex: 1000, width: '100%', top: offset() }}>
        <Media query="(max-width: 999px)">
          {matches =>
            matches ? (
              <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px', borderLeft: 5 }} selectedKeys={ selected ? selected : "home" }>
                <Menu.Item key="home"><Link to={ this.getLink("/") }><b>Khoury Admin</b></Link></Menu.Item>
                <Menu.Item key="menu-unfold" style={{ float: "right", paddingRight: 0 }}>
                  <Button type="primary" onClick={() => this.setState({ drawer_visible: true })}><Icon type="menu-unfold" style={{ marginRight: 0 }}/></Button>
                  <Drawer title="Menu" placement="right" closable={false} onClose={() => this.setState({ drawer_visible: false })} visible={this.state.drawer_visible}>
                    <List itemLayout="horizontal" dataSource={ menu.filter(el => el.permission) } renderItem={el => el.link ? ( <Link to={ el.link }><List.Item><List.Item.Meta title={ el.content }/></List.Item></Link> ) : ( <List.Item><List.Item.Meta title={ el.title ? el.title : el.content } description={ el.title ? el.content : null }/></List.Item> )} />
                  </Drawer>
                </Menu.Item>
                <Menu.Item key="menu-notification" style={{ float: "right", paddingRight: "5px" }}>
                  <NotificationCenter {...this.props} />
                </Menu.Item>
              </Menu>
            ) : (
              <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px', borderLeft: 5 }} selectedKeys={ selected ? selected : "home" }>
                <Menu.Item key="home"><Link to={ this.getLink("/") }><b>Khoury Admin</b></Link></Menu.Item>
                { menu.map((el, idx) => el.permission && <Menu.Item key={ typeof el.content == "string" ? el.content.toLowerCase() : idx } style={ el.right ? { float: "right", paddingLeft: "15px", paddingRight: "15px" } : { paddingLeft: "15px", paddingRight: "15px" } } >{ el.link ? <Link to={ el.link }>{ el.content }</Link> : el.content }</Menu.Item>) }
              </Menu>
            )
          }
        </Media>
        </Header>
      </React.Fragment>
    );
  }
}

export default NavBar;
