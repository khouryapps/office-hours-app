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

import OfficeHoursSchedule from './OfficeHoursSchedule'



export default class StudentHomeScreen extends React.Component {

  render() {

    // looks for the course_id param passed
    const course_name = this.props.navigation.getParam('course_name', '')
    const course_id = this.props.navigation.getParam('course_id', null)


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
            <Title>{course_name}</Title>
          </Body>
          <Right />
        </Header>
          <OfficeHoursSchedule course_name={course_name} course_id={course_id}/>
      </Container>
    );
  }
}
