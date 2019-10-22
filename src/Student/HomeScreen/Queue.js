import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "react-navigation";
import {
    Button,
    Text,
    Icon,
    Item,
    Footer,
    FooterTab,
    Label, Container, Left, Body, Title, Header, Right
} from "native-base";
import HeaderBar from "../../Common/components/HeaderBar";


export default class Queue extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };


    render() {
        return <Container>
            {/*<HeaderBar title="Queue"/>*/}
            <Text>This would be the queue</Text>
        </Container>
    }
}
