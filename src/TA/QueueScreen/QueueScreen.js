import React from "react"

import {
    Button,
    Container,
    Icon,
    Left,
    Body,
    Title,
    Right,
    Text,
    Header,
    Footer,
    Tab, Tabs
} from 'native-base';
import QueueList from './QueueList'
import QueueCode from './QueueCode'
import CurrentlyHelping from './CurrentlyHelping'
import { AsyncStorage, Modal, StyleSheet, ScrollView} from "react-native";
import {apiFetchQueueData, apiUpdateTAStatus, apiUpdateTicket} from "../api";


export default class QueueScreen extends React.Component {
    state = {
        queue_id: null,
        office_hours_id: null,
        tickets: [],
        loading: true,
        show_modal: false,
        fetch_error: null,
    };

    async componentDidMount() {
        const username = await AsyncStorage.getItem('username');
        const show_modal = await this.props.navigation.getParam('show_modal', 'false');
        const queue_id = await this.props.navigation.getParam('queue_id', null);
        const office_hours_id = await this.props.navigation.getParam('office_hours_id', null);
        this.setState({
            username: username,
            queue_id: queue_id,
            office_hours_id: office_hours_id,
            show_modal: show_modal,
        })

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

    closeModal = () => {
        this.setState({show_modal: false});
    }

    retrieveTicketsCurrentlyHelping = () => {
        const ticketsCurrentlyHelping = this.state.tickets.filter(ticket => (ticket.ta_helped === this.state.username && ticket.status === "In Progress"))
        console.log("tickets Currently Helping: ", ticketsCurrentlyHelping)
        return ticketsCurrentlyHelping
    }

    render() {
        const ticketsCurrentlyHelping = this.retrieveTicketsCurrentlyHelping()
        const ticketsShownInQueue = this.state.tickets.filter(ticket => (ticket.status !== "Closed"))
        const {loading, show_modal, queue_code} = this.state
        console.log("queue id:", this.state.queue_id)
        if (!loading) {
            return (
                <Container>
                    <Header>
                        <Left style={{flex: 1}}>
                        </Left>
                        <Body style={{flex: 1}}>
                            <Title>Queue</Title>
                        </Body>
                        <Right style={{flex: 1}}>
                            <Button transparent onPress={() => this.updateQueue()}>
                                <Icon name='refresh'/>
                            </Button>
                        </Right>
                    </Header>
                    { (show_modal) ?
                        <QueueCode modalVisible={true} closeModal={this.closeModal} queueCode={queue_code}/>
                        : null }
                    <Tabs>
                        <Tab heading="Currently Helping">
                            <ScrollView style={styles.content}>
                                <CurrentlyHelping tickets={ticketsCurrentlyHelping} updateTicket={this.updateTicket}/>
                            </ScrollView>
                        </Tab>
                        <Tab heading="Queue">
                            <ScrollView style={styles.content}>
                                <QueueList tickets={ticketsShownInQueue} updateTicket={this.updateTicket}/>
                            </ScrollView>
                        </Tab>
                    </Tabs>
                    <Footer>
                        <Button onPress={() => this.handleTADeparted()} style={{flex:1, justifyContent: 'center'}}>
                            <Text>Leave Office Hours</Text>
                        </Button>
                    </Footer>
                </Container>
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