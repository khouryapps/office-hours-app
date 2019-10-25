import React from "react"

import {Button, Tabs, WhiteSpace} from "@ant-design/react-native"
import CurrentlyHelping from './CurrentlyHelping'
import TicketList from './TicketList'
import { AsyncStorage, StyleSheet, ScrollView, View, Text} from "react-native";
import {apiFetchQueueData, apiUpdateTAStatus, apiUpdateTicket} from "../api";


export default class QueueScreen extends React.Component {
    state = {
        queue_id: null,
        office_hours_id: null,
        tickets: [],
        loading: true,
        fetch_error: null,
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Queue Screen',
            headerLeft: (
                <Button
                    onPress={() => navigation.openDrawer()}><Text>*</Text></Button>
            ),
            headerRight: (
                <Button onPress={navigation.getParam('fetchQueueData')}><Text>&&</Text></Button>
            ),
            gesturesEnabled: false
        }
    };


    async componentDidMount() {
        const username = await AsyncStorage.getItem('username');
        const queue_id = await this.props.navigation.getParam('queue_id', null);
        const office_hours_id = await this.props.navigation.getParam('office_hours_id', null);
        this.setState({
            username: username,
            queue_id: queue_id,
            office_hours_id: office_hours_id,
        })
        this.props.navigation.setParams({ fetchQueueData: this.fetchQueueData });
        this.fetchQueueData()

    }

    fetchQueueData = async () => {
        const {queue_id} = this.state

        const {data, error} = await apiFetchQueueData(queue_id)
        this.setState({
            tickets: data.tickets,
            queue_id: queue_id,
            queue_code: data.code,
            fetch_error: error,
            loading: false})

    }

    updateTicket = async (ticket_id, new_status) => {
        const {data, error} = await apiUpdateTicket(ticket_id, new_status)
        const updated_ticket = data
        const new_ticket_arr = [...this.state.tickets]
        for (let i = 0; i < new_ticket_arr.length; i++) {
            if (new_ticket_arr[i].id === updated_ticket.id) {
                new_ticket_arr[i] = updated_ticket
                break
            }
        }
        this.setState({tickets: new_ticket_arr, error: error})
    }

    handleTADeparted = async () => {
        const office_hours_id = await this.props.navigation.getParam('office_hours_id', null);
        const taDeparted = this.props.navigation.getParam('taDeparted')
        taDeparted();
        this.props.navigation.navigate('TAHome')
    }

    getTicketsCurrentlyHelping = () => {
        const ticketsCurrentlyHelping = this.state.tickets.filter(ticket => (ticket.ta_helped === this.state.username && ticket.status === "In Progress"))
        console.log("tickets Currently Helping: ", ticketsCurrentlyHelping)
        return ticketsCurrentlyHelping
    }

    render() {
        const ticketsCurrentlyHelping = this.getTicketsCurrentlyHelping()
        const ticketsShownInQueue = this.state.tickets.filter(ticket => (ticket.status !== "Closed"))
        const {loading} = this.state
        console.log("queue id:", this.state.queue_id)
        if (!loading) {
            return (
                <View style={{flex: 1}}>
                    <ScrollView>
                    <Tabs tabs={[{title: "Currently Helping"}, {title: "Queue"}]}>
                                <ScrollView style={styles.content}>
                                    <CurrentlyHelping tickets={ticketsCurrentlyHelping} updateTicket={this.updateTicket}/>
                                </ScrollView>
                                <ScrollView style={styles.content}>
                                    <TicketList tickets={ticketsShownInQueue} updateTicket={this.updateTicket} showButtonOnStatus={"Open"}/>
                                </ScrollView>
                    </Tabs>
                    </ScrollView>
                    <View>
                        <Button type="warning" onPress={() => this.handleTADeparted()}>
                            Leave Office Hours
                        </Button>
                        <WhiteSpace/>
                    </View>
                </View>
            )
        } else {
            return null
        }

    }
}

const styles = StyleSheet.create({
    content:{
        flex:1,
    },
});