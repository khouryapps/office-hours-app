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

import GroupedOfficeHours from './OfficeHoursSchedule'



export default class StudentHomeScreen extends React.Component {

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
          <GroupedOfficeHours/>
      </Container>
    );
  }
}
