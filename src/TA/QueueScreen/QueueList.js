import React from 'react';

import { Text, Card, CardItem, Container, Button, H2 } from 'native-base'

class ShowTicket extends React.Component {
    render() {
        const {question, tags, status} = this.props
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
                    <Text>State: {status}</Text>
                </CardItem>
                <CardItem>
                    {status === "Open" ?
                        <Button onpress={this.beginHelp}>Begin Helping</Button>
                        : null}
                </CardItem>
            </Card>
        )
    }
}

export default class QueueList extends React.Component {
    render() {
        const {tickets} = this.props
        console.log("tickets: ", tickets)
        return (
            <Container>
                <H2>Current Queue Size: {tickets.length}</H2>
                {tickets.filter(el => {return el.status === "Open" || el.status === "In Progress"}).map(el => <ShowTicket {...el}/>)}
            </Container>
        )
    }
}