import React, { Component } from "react";
import { BrowserRouter as Router, Switch as RouterSwitch, Route, Link, Redirect } from "react-router-dom";
import moment from "moment-timezone";
import QRCode from 'qrcode.react';
import Moment from 'react-moment/dist/index';
import queryString from 'query-string/index';
import AppComponent from './AppComponent';
import NavBar from "./NavBar";
import Login from "./Login/Login";
import UserRequirementsForm from "./Login/UserRequirementsForm";
import {CannotImpersonate, NoGroups, NoInstructor } from "./Login/Fail";
import ErrorBoundary from "./ErrorBoundary";
import LoggedInComponent from "./LoggedInComponent";
import Content from "./Content";
import OfficeHours from "officehours"

import { PageHeader, Layout, Menu, Breadcrumb, Icon, Table, Tag, Tooltip, Spin, Divider, Form, Switch, message, Modal, List, Card, InputNumber, Alert, Tabs, Upload, Button, Select } from 'antd/lib/index';

import 'array-flat-polyfill';

const FormItem = Form.Item;
const { SubMenu } = Menu;
const { Option } = Select;
const { Sider, Footer } = Layout;
const TabPane = Tabs.TabPane;

const PREFIX = "";

const VERSION = "[AIV]{version}[/AIV]";
const VERSION_DATE = "[AIV]{date}[/AIV]";




class Root extends Component {
  state = {
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),
    login_error: null,

    need_2fa: false,
    error_2fa: null,

    backgroundImage: "url(" + "/static/frontend/images/"+Math.floor(Math.random() * Math.floor(4))+".jpg" + ")"
  }

  handle_login = (e, data) => {
    const { need_2fa } = this.state;

    var body = { username: data.login_username, password: data.login_password };
    if (need_2fa) {
      body.code = data.login_code;
    }

    e.preventDefault();
    fetch('/api/rest-auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(json => {
        if (json["2fa_needed"]) {
          this.setState({ need_2fa: true, error_2fa: json["2fa_error"] });
        } else if (json.key) {
          if (data.login_remember) {
            localStorage.setItem('token', json.key);
          } else {
            sessionStorage.setItem('token', json.key);
          }
          this.setState({
            token: json.key,
            login_error: null,
            need_2fa: false,
            error_2fa: null,
          });
        } else if (json.error || json.detail) {
          this.setState({
            login_error: json.error ? json.error : json.detail,
            need_2fa: false,
            error_2fa: null,
          });
        } else {
          this.setState({
            login_error: "Unrecognized response from server.",
            need_2fa: false,
            error_2fa: null,
          });
        }
      });
  };

  admin_site = () => {
    const { token } = this.state;

    const cookie = "token=" + token + "; " + (window.location.protocol == 'https:' ? "secure; " : "") + "path=/admin/; samesite=Strict; max-age=" + (15 * 60);
    document.cookie = cookie;
    window.open("/admin/", "_blank");
  }

  logged_out = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    this.setState({
      token: null,
      login_error: null,
    });
    const cookie = "token=; " + (window.location.protocol == 'https:' ? "secure; " : "") + "path=/admin/; samesite=Strict";
    document.cookie = cookie;
    message.success("You have been logged out.");
  };

  render() {
    const { nuid, token, login_error, nuid_error, need_2fa, error_2fa, backgroundImage } = this.state;

    if (token) {
      return ( <Router basename={ PREFIX } key="router">
                 <RouterSwitch>
                   <Route path="/" render={(props) => <App {...props} key="app" token={ token } logged_out={ this.logged_out } admin_site={ this.admin_site } backgroundImage={ backgroundImage } /> } />
                 </RouterSwitch>
               </Router> );
    } else {
      return ( <Login handle_login={ this.handle_login } login_error={ login_error } need_2fa={ need_2fa } error_2fa={ error_2fa } backgroundImage={ backgroundImage }/> );
    }
  }
}

class Enable2FA extends AppComponent {
  state = {
    endpoint: "/api/user/2fa/",
    loading: true,
    key: null,
    code: null,

    error: null,
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      this.doGet(this.state.endpoint, (data) => {
        this.setState({ key: data.key, loading: false });
      });
    }
  }

  reset = () => {
    this.setState({ loading: true, key: null, code: null, error: null });
  }

  tryConfirm = () => {
    const { onSuccess, onCancel } = this.props;
    const { code } = this.state;

    this.doPost(this.state.endpoint, (data) => {
      if (data.success) {
        this.reset();
        onSuccess();
      } else {
        this.setState({ error: "Your 2FA code was incorrect. Please double-check your entry and try again." })
      }
    }, JSON.stringify({code: code}));
  }

  render() {
    const { visible, user, onCancel } = this.props;
    const { loading, key, error } = this.state;

    const issuer = "Khoury%20Admin" + (this.is_beta() ? "%20%28beta%29" : this.is_local() ? "%20%28local%29" : "");
    const url = loading ? null : "otpauth://totp/" + issuer + ":" + user.username + "?secret=" + key + "&issuer=" + issuer + "&algorithm=SHA1&digits=6&period=30";

    return (
        <Modal
          visible={ visible }
          title={ "Enable Two Factor Authentication" }
          okText={ "Confirm" }
          onOk={ () => { this.tryConfirm() } }
          onCancel={ () => { this.reset(); onCancel() } }
          width={600} >
          <p>This will set up two-factor authentication (2FA) for logging in to the Khoury Administration site.
             You will need to load the key below into a mobile app for generating time-based one-time password (TOTP) codes, such as Google Authenticator.
             Once you have done so, enter the code displayed in the box below in order to confirm you have set it up correctly.</p>
          <p><b>Important note:</b> If you lose your mobile device or are otherwise unable to generate a code, <i>you will not be able to log in</i>.</p>
          { error ? <Alert type="error" showIcon message={ error } /> : null }
          <Divider orientation="left">Step 1: Scan QR Code with mobile device</Divider>
          <p>Using your mobile 2FA app, scan the code below.</p>
          <div align="center">{ loading ? <Spin tip="Loading 2FA data..." /> : <QRCode value={ url } /> }</div>
          <Divider orientation="left">Step 2: Enter 6-digit code shown on device</Divider>
          <p>Enter the code the app generates below to confirm the setup.</p>
          <div align="center"><InputNumber size="large" min={0} max={999999} onChange={e => this.setState({ code: e, error: null })} disabled={ loading } ref={ (input) => input && input.focus() } /></div>
        </Modal>
      );
  }
}

class Disable2FA extends AppComponent {
  state = {
    endpoint: "/api/user/2fa/",
    code: "",
    error: null,
  }

  tryConfirm = () => {
    const { onSuccess, onCancel } = this.props;
    const { code } = this.state;

    this.doDelete(this.state.endpoint, (data) => {
      if (data.success) {
        onSuccess();
      } else {
        this.setState({ error: "Your 2FA code was incorrect.  Please double-check your entry and try again." })
      }
    }, JSON.stringify({ code: code }));
  }

  render() {
    const { visible, user, onCancel } = this.props;
    const { error } = this.state;

    return (
        <Modal
          visible={ visible }
          title={ "Disable Two Factor Authentication" }
          okText={ "Remove 2FA" }
          onOk={ () => { this.tryConfirm() } }
          okButtonProps={{ type: "danger" }}
          onCancel={ onCancel }
          width={600} >
          <p>This will remove two-factor authentication (2FA) from your account on the Khoury Administration site.  This will make your account less secure, and it is not recommended.  Are you sure you wish to remove 2FA?</p>
          { error ? <Alert type="error" showIcon message={ error } /> : null }
          <Divider orientation="left">Enter 6-digit code shown on device</Divider>
          <p>Enter the code below to confirm removal of two-factor authentication.</p>
          <div align="center"><InputNumber size="large" min={0} max={999999} onChange={e => this.setState({ code: e, error: null })} ref={ (input) => input && input.focus() } /></div>

        </Modal>
      );
  }
}

class App extends LoggedInComponent {

  state = {
    user: null,
    semester_list: null,
    semesters_list_grouped: null,
    semestertype_list: null,
    campus_list: null,
    positionyear_list: null,
    course_list: null,
    subject_list: null,
    method_list: null,
    room_list: null,

    semester: null,
    semesters: null,
    campus: null,

    semester_default: null,
    loading_message: "",

    enable2fa_visible: false,
    disable2fa_visible: false,
  };

  getQueryString = (addTab) => {
    const { user, campus, semester } = this.state;
    const values = queryString.parse(window.window.location.search);

    const query = "?semester=" + (semester ? semester : values["semester"]) + "&campus=" + (campus ? campus : values["campus"]) + (addTab && values["tab"] ? ("&tab=" + values["tab"]) : "");
    return query.replace(" ", "+");
  }

  updateQueryString = () => {
    window.history.pushState({}, "", window.location.pathname + this.getQueryString(true));
  }

  setSemester = (semester) => {
    const { semesters_list_grouped } = this.state;

    const semesters = semesters_list_grouped[semester].map(el => el.id);
    this.setState({ semester: semester, semesters: semesters }, this.updateQueryString);
    this.doPatch("/api/user/details/profile/", data => this.setState({ user: data }), JSON.stringify({ semester: semesters[0] }));
  }

  setCampus = (campus) => {
    this.setState({ campus: campus }, this.updateQueryString);
    this.doPatch("/api/user/details/profile/", data => this.setState({ user: data }), JSON.stringify({ campus: campus }));
  }

  loadData = (name, endpoint, func) => {
    this.doGet(endpoint, data => {
      if (data) {
        var newdata = {};
        data.forEach(el => newdata[el.id] = el);
        func(newdata);
        this.setState({ loading_message: name.replace("_list", "s") });
      } else {
        message.error("Received null " + name + " list.");
      }
    });
  }

  loadDataDefault = (name, endpoint, func) => {
    this.loadData(name, endpoint, data => { this.setState({ [name]: data}) });
  }

  semesterGroup = (semester) => {
    const result = semester.name.match(/^(\w+).* (\d+)$/);
    return result[1] + " " + result[2];
  }

  receiveSemesters = (data) => {
    const { user } = this.state;
    
    var possible = Object.values(data);
    possible.sort((a, b) => b.code - a.code);
    const semester_default = this.semesterGroup(possible.filter(el => moment(el.startdate, "YYYY-MM-DD") <= moment())[0]);
    const grouped = possible.reduce((r, a) => { r[this.semesterGroup(a)] = r[this.semesterGroup(a)] || []; r[this.semesterGroup(a)].unshift(a); return r; }, {});

    this.setState({ semester_list: data, semesters_list_grouped: grouped, semester_default: semester_default }, () => {
      // first set it to the default
      var semester = semester_default;

      // if the user has a semester in the DB, that overrides it
      if (user.semester) {
        const found = Object.keys(grouped).find(a => grouped[a].find(s => s.id == user.semester));
        
        if (found) {
          semester = found;
        }
      }

      // if there is a semester in the URL query, that trumps everything
      const values = queryString.parse(window.location.search);
      if (("semester" in values) && (values["semester"] in grouped)) {
        semester = values["semester"];
      }
      
      this.setSemester(semester);
    });
  }

  receiveCampuses = (data) => {
    const { user } = this.state;

    // first set it to the user's first campus
    var campus = user.campuses[0];
    
    
    // if the user has a campus in the DB, that overrides it
    if (user.campus) {
      campus = user.campus;
    }

    // if there is a campus in the URL query, that trumps everything
    const values = queryString.parse(window.location.search);
    if ("campus" in values) {
      const p_campus = parseInt(values["campus"]);
      if (data[p_campus]) {
        campus = p_campus;
      }
    }

    this.setState({ campus_list: data }, () => this.setCampus(campus));
  }

  start_impersonate = (user) => {
    this.doGet("/api/impersonate/" + user + "/", () => { window.location.reload(); })
  }

  stop_impersonate = () => {
    this.doGet("/api/impersonate/", () => { window.location.reload(); })
  }

  enable_2fa = () => {
    this.setState({ enable2fa_visible: true });
  }

  enable_2fa_success = () => {
    const { user } = this.state;
    user.has_2fa = true;
    this.setState({ user: user, enable2fa_visible: false }, () => message.success("2FA has successfully been added to your account."));
  }

  enable_2fa_cancel = () => {
    this.setState({ enable2fa_visible: false }, () => message.info("Cancelled addition of 2FA to your account."));
  }

  disable_2fa = () => {
    this.setState({ disable2fa_visible: true });
  }

  disable_2fa_success = () => {
    const { user } = this.state;
    user.has_2fa = false;
    this.setState({ user: user, disable2fa_visible: false }, () => message.success("2FA has successfully been removed to your account."));
  }

  disable_2fa_cancel = () => {
    this.setState({ disable2fa_visible: false }, () => message.info("Retained 2FA on your account."));
  }

  getUser = (func) => {
    this.doGet("/api/user/details/", data => this.setState({ user: data, campus: data.campuses[0] }, func));
  }

  receiveUser = () => {
    this.loadData("semester_list", "/api/semester/", this.receiveSemesters);
    this.loadData("campus_list", "/api/campus/", this.receiveCampuses);
    this.loadDataDefault("course_list", "/api/course/");
    this.loadDataDefault("semestertype_list", "/api/semester/type/");
    this.loadDataDefault("method_list", "/api/method/");
    this.loadDataDefault("subject_list", "/api/subject/");
    this.loadDataDefault("room_list", "/api/room/");
  }


  isCompletelyLoaded = () => {
    const { user, campus_list, semester_list, course_list, room_list, campus, semester, subject_list} = this.state;

    return user && semester_list && campus_list && course_list && room_list && subject_list && campus && semester;
  }

  handle_userrequirements = (data) => {
    this.doPost('/api/user/details/update/', () => this.getUser(), JSON.stringify(data.campus && data.nuid ? { "campus": data.campus, "nuid": data.nuid } : data.campus ? { "campus": data.campus}  : { "nuid": data.nuid }));
  };

  handle_instructor = () => {
    this.doPost('/api/user/details/link/', () => this.getUser(), JSON.stringify({}));
  }

  permission = (type, required) => {
    const perm = this.state.user.groups.map(el => el.name);
    if ((type == "can") || (type == "cannot")) {
      if (perm.includes("admin") && type == "can") return type == "can";
      return type == "can" ? perm.includes(required) : !perm.includes(required);
    } else if (type == "is") {
      return perm.includes(required);
    }
  }

  componentDidMount() {
    this.getUser(this.receiveUser);
  }

  render() {
    const { match, admin_site, logged_out, backgroundImage } = this.props;
    const { enable2fa_visible, disable2fa_visible, loading_message } = this.state;

    const baseProps = {
      version: VERSION,
      version_date: VERSION_DATE,

      token: this.props.token,
      user: this.state.user,
      semester: this.state.semester,
      semesters: this.state.semesters,
      campus: this.state.campus,

      semester_list: this.state.semester_list,
      semesters_list_grouped: this.state.semesters_list_grouped,
      semestertype_list: this.state.semestertype_list,
      campus_list: this.state.campus_list,
      course_list: this.state.course_list,
      method_list: this.state.method_list,
      room_list: this.state.room_list,
      subject_list: this.state.subject_list,
      onSetSemester: this.setSemester,
      onSetCampus: this.setCampus,

      getQueryString: this.getQueryString,
    }

    if (!this.state.user || !this.state.semester_list || !this.state.campus_list) {
      return ( <div className="loading"><Spin tip="Logging you in..." /></div> );
      
    } 
      if ((!this.state.user.nuid || !this.state.user.campuses || this.state.user.campuses.length == 0) && this.state.user.impersonator) {
      return(<CannotImpersonate {...baseProps} stop_impersonate = {this.stop_impersonate} backgroundImage={ backgroundImage } /> ); 
    } else if (!this.state.user.nuid || !this.state.user.campuses || this.state.user.campuses.length == 0) {
      return ( <UserRequirementsForm {...baseProps} handle_userrequirements={ this.handle_userrequirements } user={ this.state.user } campuses={ this.state.campuses } backgroundImage={ backgroundImage } /> );
    } else if (this.state.user.groups.length == 0) {
      return ( <NoGroups {...baseProps} backgroundImage={ backgroundImage } /> );
    } else if ((this.permission("is", "faculty")) && (this.state.user.instructor == null)) {
      return ( <NoInstructor {...baseProps} backgroundImage={ backgroundImage } /> );
    } else if (!this.isCompletelyLoaded()) {
      return ( <div className="loading"><Spin tip={ ["Loading Khoury Admin...", <br key="foo"/>, <small key="bar">Loaded { loading_message }</small>] } /></div> );
    } else {
      const submodules = Students.submodules(baseProps);
      return (
        <ErrorBoundary {...baseProps} key="error">
          <Layout key="main">
            <Enable2FA {...baseProps} visible={ enable2fa_visible } onSuccess={ this.enable_2fa_success } onCancel={ this.enable_2fa_cancel } />
            <Disable2FA {...baseProps} visible={ disable2fa_visible } onSuccess={ this.disable_2fa_success } onCancel={ this.disable_2fa_cancel } />
            <NavBar {...baseProps} key="navbar" logged_out={ logged_out } setNotificationViewed={ this.setNotificationViewed } setNotificationSettings={ this.setNotificationSettings} admin_site={ admin_site } enable_2fa={ this.enable_2fa } disable_2fa={ this.disable_2fa } start_impersonate={ this.start_impersonate }stop_impersonate={ this.stop_impersonate } />


            <RouterSwitch key="switch">
              <Route exact key="home" path="/" render={(props) => <Home {...props} {...baseProps} key="home" submodules={ submodules } /> }/>
              { this.permission("can", "students") &&
              <Route path="/students" render={(props) => <Students {...props} {...baseProps} /> }/>
              }
              <Route render={(props) => <Redirect to="/" /> } />
            </RouterSwitch>
          </Layout>
        </ErrorBoundary> 
      );
    }
  }
}

// ----- ABSTRACT CLASS -----

class AppModule extends AppComponent {

 renderItem = (item) => {
    const label = ( <React.Fragment><Icon type={ item.icon } />{ item.name }</React.Fragment> );

    if (item.link) {
      return <Menu.Item key={ item.name }><Link to={ this.getLink(item.link) }>{ label }</Link></Menu.Item>
    } else {
      return <Menu.Item key={ item.name } disabled>{ label }</Menu.Item>
    }
  }

  check_show = (e) => {
    if (! ("show" in e)) { return true; }
    if (typeof e.show == "boolean") { return e.show; }
    if (typeof e.show == "string") { return this.permission("can", e.show); }
    if (typeof e.show == "object") { return e.show.reduce((r, a) => r || this.permission("can", a), false); }
    if (typeof e.show == "function") { return e.show(); }
    return false;
  }

  renderSider = (items) => {
    const selected = items.map(e => e.items ? [e].concat(e.items) : [e]).flat().find(e => e.link == window.location.pathname);

    return (
      <Sider width={200}
             style={{ background: '#fff', marginTop: this.top_margin(), zIndex: 900, minHeight: "calc(100vh - " + this.top_margin() + "px)" }}
             collapsedWidth={0}
             breakpoint="lg"
             key="sider"
      >
        <Menu
          mode="inline"
          key="menu"
          defaultOpenKeys={ items.filter(el => el.items).map(el => el.name) }
          style={{ height: '100%', borderRight: 0 }}
          selectedKeys={ selected ? [selected.name] : [] }
        >
          {items.filter(this.check_show).map(el => {
            if (el.items) {
                return (
                  <SubMenu key={ el.name } title={<span><Icon type={ el.icon } /><span>{ el.name }</span></span>}>
                    { el.items.filter(this.check_show).map(this.renderItem) }
                    </SubMenu>
                  );
            } else {
              return this.renderItem(el);
            }
          } )}
        </Menu>
      </Sider>
    );
  }
}

class ModuleHome extends AppComponent {
  check_show = (e) => {
    if (! ("show" in e)) { return true; }
    if (typeof e.show == "boolean") { return e.show; }
    if (typeof e.show == "string") { return this.permission("can", e.show); }
    if (typeof e.show == "object") { return e.show.reduce((r, a) => r || this.permission("can", a), false); }
    if (typeof e.show == "function") { return e.show(); }
    return false;
  }

  get_cards = () => {
    const { submodules } = this.props;
    const chars = submodules.filter(el => el.cards && this.check_show(el)).map(el => el.cards).flat().filter(el => el != null);

    return (
        <List
            grid={ this.grid }
            dataSource={ chars }
            renderItem={(item, idx) => ( <List.Item key={ idx }>{ item }</List.Item> )}
        />
    )
  };
}


class Home extends ModuleHome {
  render() {
    return (
        <Layout style={{ padding: '0 0 0 0', marginTop: this.top_margin(), minHeight: "calc(100vh - " + this.top_margin() + "px)" }}>
          <Content {...this.props} title={ "Khoury Administration" } breadcrumbs={ [{ text: "Home" }] }>
            Welcome to the Khoury Administration site!  Use the links above to navigate to different modules; the cards below provide a brief overview of the features available to you.
            <Divider orientation="left">Your snapshot</Divider>
            { this.get_cards() }
          </Content>
        </Layout>
    );
  }
}


class StudentHome extends ModuleHome {
  render() {
    return (
        <Content {...this.props} title={ "Student Services" } breadcrumbs={ [{ text: "Students" }] }>
          This page contains links to all available Students services; please use the links below or on the sidebar to navigate.
          <Divider orientation="left">Your snapshot</Divider>
          { this.get_cards() }
        </Content>
    )
  }
}

// ----- STUDENTS MODULE -----

class Students extends AppModule {
  static submodules(props) {
    var submodules = [];

    submodules = submodules
    .concat([{ icon: "team", name: "OfficeHours",  items: [{ icon: "file-unknown", name: "Student", link: "/students/officehours/student/"}, { icon: "snippets", name: "TA", link: "/students/officehours/ta/"}]}]);
    return submodules;
  }


  render() {
    const sidemenu = this.renderSider(Students.submodules(this.props));
    return (
      <Layout>
        { sidemenu }
        <Layout style={{ padding: '0 0 0 0', marginTop: this.top_margin(), minHeight: "calc(100vh - " + this.top_margin() + "px)" }}>
          <ErrorBoundary {...this.props}>
            <RouterSwitch>
              <Route path="/students/officehours/student/" render={(props) => <OfficeHours {...this.props} {...props} isTA={false}/> }/>
              <Route path="/students/officehours/ta/" render={(props) => <OfficeHours {...this.props} {...props} isTA={true}/> }/>
              <Route path="/students/" render={(props) => <StudentHome {...this.props} {...props} submodules={ Students.submodules(this.props) } /> }/>
            </RouterSwitch>
          </ErrorBoundary>
        </Layout>
      </Layout>
    );
  }
}

export default Root;
