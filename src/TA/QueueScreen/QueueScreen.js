import React from "react"

import { Button, Container, Icon, Left, Body, Title, Right, Header } from 'native-base';
import QueueList from './QueueList'
import CurrentlyHelping from './CurrentlyHelping'
import {AsyncStorage} from "react-native";


export default class QueueScreen extends React.Component {
    state = {
        tickets: []
    };
    async componentDidMount(){
        const userToken = await AsyncStorage.getItem('userToken');
        const username = await AsyncStorage.getItem('username');
        try {
            //Assign the promise unresolved first then get the data using the json method.
            const apiCall = await fetch('http://127.0.0.1:8002/api/officehours/queue/2/',
                {method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9"
                }});
            const queue_info = await apiCall.json();
            this.setState({
                tickets: queue_info.tickets,
                userToken: userToken,
                username: username,
            });
            console.log("tickets,", this.state.tickets)
        } catch (err) {
            console.log("Error fetching data:", err);
        }
    }

    updateStatus = async (ticket_id, new_status) => {
        try {
            const apiCall = await fetch('http://127.0.0.1:8002/api/officehours/ticket/edit/' + ticket_id + '/',
                {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9"
                    },
                    body: JSON.stringify({
                        status: new_status,
                    }),
                });
            const updated_ticket = await apiCall.json()
            const new_ticket_arr = [...this.state.tickets]
            for (let i=0; i<new_ticket_arr.length; i++) {
                if (new_ticket_arr[i].id === updated_ticket.id) {
                    new_ticket_arr[i] = updated_ticket
                    break
                }
            }
            this.setState({tickets: new_ticket_arr})
        }
        catch (err) {
            console.log("ERROR Fetching Data: ", err)
        }
    }

    retrieveTicketsCurrentlyHelping = () => {
        const ticketsCurrentlyHelping = this.state.tickets.filter(ticket => (ticket.ta_helped === this.state.username && ticket.status === "In Progress"))
        console.log("tickets Currently Helping: ", ticketsCurrentlyHelping)
        return ticketsCurrentlyHelping
    }

    render() {
        const ticketsCurrentlyHelping = this.state.tickets.filter(ticket => (ticket.ta_helped === this.state.username && ticket.status === "In Progress"))
        const ticketsShownInQueue = this.state.tickets.filter(ticket => (ticket.status !== "Closed" && !(ticket.ta_helped === this.state.username && ticket.status === "In Progress")))
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
                <CurrentlyHelping tickets={ticketsCurrentlyHelping} updateStatus={this.updateStatus}/>
                <QueueList tickets={ticketsShownInQueue} updateStatus={this.updateStatus}/>
            </Container>
        )
    }
}