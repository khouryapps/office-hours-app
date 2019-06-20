import React from "react"

import { Button, Container, Icon, Left, Body, Title, Right, Header } from 'native-base';
import QueueList from './QueueList'


export default class QueueScreen extends React.Component {
    state = {
        tickets: []
    };
    async componentDidMount(){
        try {
            //Assign the promise unresolved first then get the data using the json method.
            const apiCall = await fetch('http://127.0.0.1:8002/api/officehours/queue/2/', {method: 'GET', headers: {Authorization: "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9"}});
            const queue_info = await apiCall.json();
            this.setState({
                tickets: queue_info.tickets,
            });
        } catch (err) {
            console.log("Error fetching data:", err);
        }
    }

    render() {
        console.log("tickets state", this.state.tickets)
        return (
            <Container>
                <Header>
                    <Left style={{flex:1}}>
                        <Button transparent>
                            <Icon name='menu'/>
                        </Button>
                    </Left>
                    <Body style={{flex:1}}>
                        <Title>Student Queue</Title>
                    </Body>
                    <Right style={{flex:1}}/>
                </Header>
                <QueueList tickets={this.state.tickets}/>
            </Container>
        )
    }
}