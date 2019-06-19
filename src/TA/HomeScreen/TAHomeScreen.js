import React from "react";

import { Container, Header, Left, Right, Body, Button, Icon, Title, Text } from 'native-base';
import { OfficeHours } from '../../Student/HomeScreen/OfficeHours'

export default class TAHomeScreen extends React.Component {
    constructor(props){
        super(props);
        this.state ={ isLoading: true }
    }

    componentDidMount(){
        return fetch('http://127.0.0.1:8002/api/officehours/schedule/upcoming/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9",
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    nextOfficeHours: responseJson[0],
                }, function(){

                });
                console.log("compontent did mount", responseJson)
            })
            .catch((error) =>{
                console.error(error);
            });
    }

    I_AM_HERE = () => {
        fetch('http://127.0.0.1:8002/api/officehours/changestatus/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9",
            },
            body: JSON.stringify({
                office_hours_id: 5,
                status: 'arrived',
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
            console.log("I AM HERE RESPONSE:", responseJson)
        });
    }

    render() {
        const {nextOfficeHours} = this.state;

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name='menu' />
                        </Button>
                    </Left>
                        <Body>
                            <Title>TA Overview</Title>
                        </Body>
                    <Right/>
                </Header>
                <Text>Upcoming Office Hours:</Text>
                <OfficeHours {...nextOfficeHours} />
                <Text></Text>
                <Button onPress={this.I_AM_HERE}>
                    <Text>I AM HERE</Text>
                </Button>
                <Button onPress={() => this.props.navigation.navigate('QueueScreen')}>
                    <Text>GO TO QUEUE</Text>
                </Button>
            </Container>
        );
    }

}