import React from "react";
import { StatusBar } from "react-native";
import {Form, Item, Input} from 'native-base'
import {
  Button,
  Text,
  Container,
  Card,
  CardItem,
  Body,
  Content,
  Header,
  Title,
  Left,
  Icon,
  Right,
    Footer,
    FooterTab,
    List,
    ListItem
} from "native-base";

import JoinedOfficeHours from './OfficeHours'

export default class Root extends React.Component {
  state = {
    loggedIn: true
  };

  render() {
    const {loggedIn} = this.state;
    return loggedIn ? <HomeScreen {...this.props} /> : <SignIn />
  }
}


class HomeScreen extends React.Component {
  state = {
    officeHours: [{ta_application: {"name": "Will"}, id:1, room: "WVH 220", date: '06/10/2019', start_time: "10:00", end_time: "11:00"},
      {ta_application: {"name": "Grisha"}, id:2, room: "WVH 130", date: "06/10/2019", start_time: "11:00", end_time:"12:00"},
      {ta_application: {"name": "Alex"},id:3, room: "WVH 220", date: "06/11/2019", start_time: "15:00",end_time: "15:40"}],
    loading: true
  };

  async componentDidMount() {

    //Have a try and catch block for catching errors.
    try {
      //Assign the promise unresolved first then get the data using the json method.
      const apiCall = await fetch('http://127.0.0.1:8000/api/oht/tahours/', {method: 'GET'});
      console.log('went here')
      console.log(apiCall)
      const officeHours = await apiCall.json();
      console.log('then went here');
      this.setState({officeHours: officeHours, loading: false});
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }


  render() {
    console.log(this.state.officeHours);
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Schedule</Title>
          </Body>
          <Right />
        </Header>
          <JoinedOfficeHours officeHours = {this.state.officeHours}/>
        <Footer>
          <FooterTab>
            <Button light>
              <Icon name='calendar'/>
              <Text>Schedule</Text>
            </Button>
            <Button light>
              <Icon name='clock'/>
              <Text>Queue</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

class SignIn extends React.Component {
  state = {
    username: '',
    password: '',
    need_2fa: false,
    error_2fa: null
  };

  handle_login = (e) => {
    const { need_2fa, username, password } = this.state;

    var body = { username: username, password: password };
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

  render() {
    return (
        <Container>
          <Header />
          <Content>
            <Form>
              <Item>
                <Input onChange={e => this.setState({username: e.target.value})} placeholder="Username" />
              </Item>
              <Item last>
                <Input onChange={e => this.setState({password: e.target.value})} placeholder="Password" />
              </Item>
              <Item>
                <Button onClick={e=>this.handle_login}>Log In</Button>
              </Item>
            </Form>
          </Content>
        </Container>
    );
  }
}
