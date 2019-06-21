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


export default class Queue extends React.Component {

    render() {
        return <Container>
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
                    <Title>Queue</Title>
                </Body>
                <Right />
            </Header>
            <Text>This would be the queue</Text>
        </Container>
    }
}
