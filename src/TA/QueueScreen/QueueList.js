import React from 'react';

import { View, H2 } from 'native-base'
import ShowTicket from './ShowTicket'



export default class QueueList extends React.Component {


    render() {
        const {tickets} = this.props
        if (tickets.length) {
            return (
                <View>
                    <H2>Current Queue Size: {tickets.filter((ticket) => { return ticket.status === "Open" || ticket.status === "In Progress" }).length }</H2>
                    {tickets.map(el => <ShowTicket updateTicket={this.props.updateTicket} showButtonOnStatus={"Open"} key={el.id} {...el}/>)}
                </View>
            )
        } else {
            return <H2>The current queue is empty</H2>
        }

    }
}