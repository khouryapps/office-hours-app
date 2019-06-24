import React from "react"
import {Button, Card, CardItem, Container, H2, Text} from "native-base"
import ShowTicket from "./ShowTicket";

export default class CurrentlyHelping extends React.Component {
    render() {
        const {tickets} = this.props;
        if (tickets.length) {
            return (
                <Container>
                    <H2>Currently Helping</H2>
                    {tickets.map(el => <ShowTicket updateStatus={this.props.updateStatus} showButtonOnStatus={"In Progress"} key={el.id} {...el}/>)}
                </Container>)
        } else {
            return null
        }
    }
}


