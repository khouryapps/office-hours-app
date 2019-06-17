import React from "react";
import { AppRegistry, Image, StatusBar } from "react-native";
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content, Thumbnail,
  Icon
} from "native-base";
const routes = ["", "Chat", "Profile"];
export default class SideBar extends React.Component {
    state = {
        photo: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
        student_name: 'Will Stenzel',
        courses_list: ["CS3500", "CS5000", "CS1700"]

    };
  render() {
    return (
      <Container>
        <Content>
          <Thumbnail
            source={{
              uri:
                this.state.photo
            }}
            style={{
              height: 75,
              width: 75,
              alignSelf: "center",
              position: "absolute",
                top:80
            }}
          />
          <Text style={{marginTop: 200, alignSelf: 'center', padding: 20, borderColor: 'black',
              borderWidth: 1, borderRadius: 3}}>{this.state.student_name}</Text>
            <Text style ={{marginTop:100, alignSelf: 'center'}}>Courses List</Text>
          <List
            dataArray={this.state.courses_list}
            contentContainerStyle={{ marginTop: 50}}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(data)}
                >
                  <Text>{data}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}
