import React from "react"
import {View, Text} from "react-native"
import {Button} from "@ant-design/react-native"
import TicketList from "./TicketList"
import styles from "../../Style"

export default class CurrentlyHelping extends React.Component {

    updateAllStatus = () => {
        this.props.tickets.map(el => this.props.updateTicket(el.id, "Resolved"))
    }
    render() {
        const {tickets} = this.props;
        if (tickets.length) {
            return (
                <View>
                    <TicketList tickets={tickets} updateTicket={this.props.updateTicket} showButtonOnStatus={"Open"} />
                    {tickets.length > 1 ?
                        (<Button onPress={() => this.updateAllStatus()} style={{flex:1, justifyContent: 'center'}}>
                            <Text>Finish Helping All</Text>
                        </Button>) :
                        null}
                </View>)
        } else {
            return (
                <View>
                    <Text style={styles.headline}>No students currently helping</Text>
                </View>
            )
        }
    }
}




