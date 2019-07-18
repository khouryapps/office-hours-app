import React from "react"
import {Button, Card, CardItem, View, H2, Text} from "native-base"
import ShowTicket from "./ShowTicket";

export default class CurrentlyHelping extends React.Component {

    updateAllStatus = () => {
        this.props.tickets.map(el => this.props.updateStatus(el.id, "Closed"))
    }
    render() {
        const {tickets} = this.props;
        if (tickets.length) {
            return (
                <View>
                    <H2>Currently Helping</H2>
                    {tickets.map(el => <ShowTicket updateStatus={this.props.updateStatus}
                                                   showButtonOnStatus={"In Progress"} key={el.id} {...el}/>)}
                    {tickets.length > 1 ?
                        (<Button onPress={() => this.updateAllStatus()} style={{flex:1, justifyContent: 'center'}}>
                            <Text>Finish Helping All</Text>
                        </Button>) :
                        null}
                </View>)
        } else {
            return null
        }
    }
}


