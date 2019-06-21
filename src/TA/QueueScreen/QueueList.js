import React from 'react';

import { Text, Card, CardItem, Container, Button, H2 } from 'native-base'

class ShowTicket extends React.Component {


    render() {
        const { id, question, tags, status} = this.props
        console.log("show ticket props", this.props)
        return (
            <Card>
                <CardItem>
                    <Text>Question: {question}</Text>
                </CardItem>
                {tags.length ? (<CardItem>
                        <Text>Tags: {tags}</Text>
                    </CardItem>)
                    : null}
                <CardItem>
                    <Text>Status: {status}</Text>
                </CardItem>
                <CardItem>
                    {status === "Open" ?
                        <Button onPress={() => this.props.beginHelp(id)}>
                            <Text>Begin Helping</Text>
                        </Button>
                        : status === "In Progress" ?
                        <Button warning onPress={() => this.props.finishHelp(id)}>
                            <Text>Finish Helping</Text>
                        </Button>
                            : null}
                </CardItem>
            </Card>
        )
    }
}

export default class QueueList extends React.Component {
    beginHelp = async (ticket_id) => {
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
                        status: "In Progress",
                    }),
                });
            const api_response = await apiCall.json()
            console.log("Begin Help Response: ", api_response)
        }
        catch (err) {
            console.log("ERROR Fetching Data: ", err)
        }
    }

    render() {
        const {tickets} = this.props
        console.log("tickets: ", tickets)
        return (
            <Container>
                <H2>Current Queue Size: {tickets.length}</H2>
                {tickets.filter(el => {return el.status === "Open" || el.status === "In Progress"}).map(el => <ShowTicket beginHelp={this.beginHelp} key={el.id} {...el}/>)}
            </Container>
        )
    }
}