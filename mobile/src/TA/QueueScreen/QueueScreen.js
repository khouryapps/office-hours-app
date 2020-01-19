import React from "react"

import {Button, Tabs, WhiteSpace, Icon} from "@ant-design/react-native"
import CurrentlyHelping from './CurrentlyHelping'
import styles from "../../Style"
import TicketList from './TicketList'
import { AsyncStorage, ScrollView, View, Text} from "react-native";
import {apiFetchQueueData, apiUpdateTicket} from "../api";
import Loading from "../../Common/components/Loading";
import HeaderButton from "../../Common/components/HeaderButton";
import RefreshButton from "../../Common/components/RefreshButton";


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
            title: 'Queue',
            headerLeft: (
                <HeaderButton navigation={navigation}/>
            ),
            headerRight: (
                <RefreshButton navigation={navigation}/>
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
        this.props.navigation.setParams({ 'refreshFetch': this.fetchQueueData });
        this.fetchQueueData()
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.fetchQueueData()
        });
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
        return  this.state.tickets.filter(ticket => (ticket.ta_helped === this.state.username && ticket.status === "Open"))
    }

    render() {
        const ticketsCurrentlyHelping = this.getTicketsCurrentlyHelping()
        const ticketsShownInQueue = this.state.tickets.filter(ticket => (ticket.status !== "Resolved" && ticket.status !== "No Show"))
        const {loading} = this.state
        if (!loading) {
            return (
                <View style={{flex: 1}}>
                    <Tabs tabs={[{title: "Currently Helping"}, {title: "Queue"}]} initialPage={1}>
                                <ScrollView>
                                    <CurrentlyHelping tickets={ticketsCurrentlyHelping} updateTicket={this.updateTicket}/>
                                </ScrollView>
                                <ScrollView style={styles.content}>
                                    <TicketList tickets={ticketsShownInQueue} updateTicket={this.updateTicket} showButtonOnStatus={["In Line","Deferred"]}/>
                                </ScrollView>
                    </Tabs>
                    <View>
                        <Button type="warning" onPress={() => this.handleTADeparted()}>
                            Leave Office Hours
                        </Button>
                        <WhiteSpace/>
                    </View>
                </View>
            )
        } else {
            return <Loading/>
        }

    }
}
