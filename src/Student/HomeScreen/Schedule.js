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



export default class Schedule extends React.Component {
  state = {
    officeHours: [{ta_application: {"name": "Will"}, id:1, room: "WVH 220", date: '06/10/2019', start_time: "10:00", end_time: "11:00"},
      {ta_application: {"name": "Grisha"}, id:2, room: "WVH 130", date: "06/10/2019", start_time: "11:00", end_time:"12:00"},
      {ta_application: {"name": "Alex"},id:3, room: "WVH 220", date: "06/11/2019", start_time: "15:00",end_time: "15:40"}],
    loading: true
  };

  async componentDidMount() {

    // //Have a try and catch block for catching errors.
    // try {
    //   //Assign the promise unresolved first then get the data using the json method.
    //   const apiCall = await fetch('http://127.0.0.1:8000/api/oht/tahours/', {method: 'GET'});
    //
    //   const officeHours = await apiCall.json();
    //   this.setState({officeHours: officeHours, loading: false});
    // } catch (err) {
    //   console.log("Error fetching data-----------", err);
    // }
  }

  render() {
    const {officeHours} = this.state;
    console.log(officeHours)

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
          <JoinedOfficeHours officeHours = {officeHours}/>
      </Container>
    );
  }
}
