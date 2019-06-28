import React from "react"

import {Button, Container, Content, Icon, Left, Body, Title, Right, Text, Header, Footer, View, H3, List, ListItem} from 'native-base';
import QueueList from './QueueList'
import QueueCode from './QueueCode'
import CurrentlyHelping from './CurrentlyHelping'
import { AsyncStorage, Modal, StyleSheet, ScrollView} from "react-native";





export default class QueueScreen extends React.Component {
    state = {
        tickets: [],
        loading: true,
        show_modal: false,
    };

    async componentDidMount() {
        const userToken = await AsyncStorage.getItem('userToken');
        const username = await AsyncStorage.getItem('username');
        const show_modal = await this.props.navigation.getParam('show_modal', 'false');
        this.setState({
            userToken: userToken,
            username: username,
            loading: false,
            show_modal: show_modal,
        })
        this.updateQueue()

    }

    updateQueue = async () => {
        const queue_id = await this.props.navigation.getParam('queue_id', 'no_id');  // fixme: change the default to something else
        console.log("rendering queue screen with queue id:", queue_id);
        try {
            //Assign the promise unresolved first then get the data using the json method.
            const apiCall = await fetch('http://127.0.0.1:8002/api/officehours/queue/'+queue_id+'/',
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Token " + this.state.userToken
                    }
                });
            const queue_info = await apiCall.json();
            console.log("queue info,", queue_info)
            this.setState({
                tickets: queue_info.tickets,
                queue_id: queue_id,
                queue_code: queue_info.code,
            });
            console.log("tickets,", this.state.tickets)
        } catch (err) {
            console.log("Error fetching data:", err);
        }
    }

    updateTicketStatus = async (ticket_id, new_status) => {
        try {
            const apiCall = await fetch('http://127.0.0.1:8002/api/officehours/ticket/edit/' + ticket_id + '/',
                {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9"
                    },
                    body: JSON.stringify({
                        status: new_status,
                    }),
                });
            const updated_ticket = await apiCall.json()
            const new_ticket_arr = [...this.state.tickets]
            for (let i = 0; i < new_ticket_arr.length; i++) {
                if (new_ticket_arr[i].id === updated_ticket.id) {
                    new_ticket_arr[i] = updated_ticket
                    break
                }
            }
            this.setState({tickets: new_ticket_arr})
        } catch (err) {
            console.log("Error Updating Ticket: ", err)
        }
    }

    handleUpdateStatus = async () => {
        const updateStatus = this.props.navigation.getParam('updateStatus')
        updateStatus('departed')
        console.log('navigating back to homescreen')
        this.props.navigation.navigate('Home', )
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
        const ticketsCurrentlyHelping = this.state.tickets.filter(ticket => (ticket.ta_helped === this.state.username && ticket.status === "In Progress"))
        const ticketsShownInQueue = this.state.tickets.filter(ticket => (ticket.status !== "Closed"))
        const {loading, show_modal, queue_code} = this.state
        console.log("queue id:", this.state.queue_id)
        if (!loading) {
            return (
                <Container>
                    <Header>
                        <Left style={{flex: 1}}>
                            {/*<Button transparent>*/}
                            {/*    <Icon name='menu'/>*/}
                            {/*</Button>*/}
                        </Left>
                        <Body style={{flex: 1}}>
                            <Title>Student Queue</Title>
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
                    <ScrollView style={styles.content}>
                        <CurrentlyHelping tickets={ticketsCurrentlyHelping} updateStatus={this.updateTicketStatus}/>
                        <QueueList tickets={ticketsShownInQueue} updateStatus={this.updateTicketStatus}/>
                    </ScrollView>
                    <Footer>
                        <Button onPress={this.handleUpdateStatus} style={{flex:1, justifyContent: 'center'}}>
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