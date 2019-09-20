import React from "react";
import {AsyncStorage} from "react-native";
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



export default class ScheduleHome extends React.Component {

  render() {
    let course_name;
    let course_id;
    // looks for the course_id param passed
    course_name = this.props.navigation.getParam('course_name', '')
    course_id = this.props.navigation.getParam('course_id', null)

    // if nothing is found find the last visited course
    // if (!course_name || !course_id) {
    //   course_name = AsyncStorage.getItem("last_visited_course_name")
    //   course_id = AsyncStorage.getItem("last_visited_course_id")
    // }

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
