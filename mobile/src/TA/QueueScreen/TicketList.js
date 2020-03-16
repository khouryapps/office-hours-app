import React from 'react';

import {WhiteSpace, WingBlank} from "@ant-design/react-native";
import {ScrollView, View, Text} from "react-native";
import Ticket from './Ticket'
import {getQueueSize} from "../../utils";


export default class TicketList extends React.Component {


    render() {
        const {tickets} = this.props
        if (tickets.length) {
            return (
                <ScrollView>
                    <WingBlank size="md">
                        <Text>Current Queue Size: {getQueueSize(tickets)}</Text>
                        {tickets.map(el => <View><WhiteSpace/><Ticket updateTicket={this.props.updateTicket}
                                                                                 showButtonOnStatus={this.props.showButtonOnStatus} key={el.id} {...el}/>
                        </View>)}
                    </WingBlank>
                </ScrollView>
            )
        } else {
            return <Text style={styles.headline}>Current queue is empty</Text>
        }

    }
}