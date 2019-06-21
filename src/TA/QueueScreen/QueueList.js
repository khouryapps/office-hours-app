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
                        <Button onPress={() => this.props.updateStatus(id, "In Progress")}>
                            <Text>Begin Helping</Text>
                        </Button>
                        : status === "In Progress" ?
                        <Button warning onPress={() => this.props.updateStatus(id, "Closed")}>
                            <Text>Finish Helping</Text>
                        </Button>
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
                <H2>Current Queue Size: {tickets.filter((ticket) => { return ticket.status === "Open" || ticket.status === "In Progress" }).length }</H2>
                {tickets.filter(el => {return el.status === "Open" || el.status === "In Progress"}).map(el => <ShowTicket updateStatus={this.props.updateStatus} key={el.id} {...el}/>)}
            </Container>
        )
    }
}