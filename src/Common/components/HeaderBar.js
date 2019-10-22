import {Body, Button, Header, Icon, Left, Right, Title} from "native-base";
import React from "react";


const HeaderBar = (props) => {
    return (
        <Header>
            <Left>
                <Button
                    transparent
                    onPress={() => this.props.navigation.openDrawer()}
                >
                    <Icon name="menu"/>
                </Button>
            </Left>
            <Body>
                <Title>{props.title}</Title>
            </Body>
            <Right/>
        </Header>)
}

export default HeaderBar;



