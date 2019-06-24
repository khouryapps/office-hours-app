import React from 'react';

import { Container, H2 } from 'native-base'
import ShowTicket from './ShowTicket'



export default class QueueList extends React.Component {


    render() {
        const {tickets} = this.props
        if (tickets.length) {
            return (
                <Container>
                    <H2>Current Queue Size: {tickets.filter((ticket) => { return ticket.status === "Open" || ticket.status === "In Progress" }).length }</H2>
                    {tickets.map(el => <ShowTicket updateStatus={this.props.updateStatus} showButtonOnStatus={"Open"} key={el.id} {...el}/>)}
                </Container>
            )
        } else {
            return null
        }

    }
}