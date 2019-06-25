import React from "react"

import {Button, Container, Icon, Left, Body, Title, Right, Text, Header, View, H3} from 'native-base';
import QueueList from './QueueList'
import CurrentlyHelping from './CurrentlyHelping'
import {AsyncStorage, Modal, StyleSheet} from "react-native";


class QueueCode extends React.Component {

    render() {
        return (
            <Container>

                <View style={styles.container}>
                    <Modal
                        visible={this.props.modalVisible}
                        animationType={'slide'}
                        onRequestClose={() => this.props.closeModal()}>
                        <Header>
                            <Left style={{flex: 1}}>
                                <Button iconLeft transparent onPress={() => this.props.closeModal()}>
                                    <Icon name='arrow-back'/>
                                </Button>
                            </Left>
                            <Body style={{flex: 1}}>
                                <Title>Queue Code</Title>
                            </Body>
                            <Right style={{flex: 1}}/>
                        </Header>
                        <View style={styles.modalContainer}>
                            <View style={styles.innerContainer}>
                                <Title>Code: {this.props.queueCode}</Title>
                                <Title/>
                                <Text>Make sure this is written on the board so students can join the queue.</Text>
                            </View>
                        </View>

                    </Modal>
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    innerContainer: {
        alignItems: 'center',
    },
});


export default class QueueScreen extends React.Component {
    state = {
        tickets: [],
        loading: true,
        show_modal: true,
    };

    async componentDidMount() {
        const userToken = await AsyncStorage.getItem('userToken');
        const username = await AsyncStorage.getItem('username');
        const queue_id = this.props.navigation.getParam('queue_id', '2');  // fixme: change the default to something else
        const show_modal = this.props.navigation.getParam('show_modal', 'false');
        console.log("user token:", userToken)
        try {
            //Assign the promise unresolved first then get the data using the json method.
            const apiCall = await fetch('http://127.0.0.1:8002/api/officehours/queue/'+queue_id+'/',
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Token " + userToken
                    }
                });
            const queue_info = await apiCall.json();
            console.log("queue info,", queue_info)
            this.setState({
                tickets: queue_info.tickets,
                userToken: userToken,
                username: username,
                queue_id: queue_id,
                queue_code: queue_info.code,
                show_modal: show_modal,
                loading: false,
            });
            console.log("tickets,", this.state.tickets)
        } catch (err) {
            console.log("Error fetching data:", err);
        }
    }

    updateStatus = async (ticket_id, new_status) => {
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
            console.log("ERROR Fetching Data: ", err)
        }
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
        console.log("show modal:", show_modal)
        console.log("loading: ", loading)
        if (!loading) {
            return (
                <Container>
                    <Header>
                        <Left style={{flex: 1}}>
                            <Button transparent>
                                <Icon name='menu'/>
                            </Button>
                        </Left>
                        <Body style={{flex: 1}}>
                            <Title>Student Queue</Title>
                        </Body>
                        <Right style={{flex: 1}}/>
                    </Header>
                    { show_modal ?
                        <QueueCode modalVisible={true} closeModal={this.closeModal} queueCode={queue_code}/>
                        : null }
                    <CurrentlyHelping tickets={ticketsCurrentlyHelping} updateStatus={this.updateStatus}/>
                    <QueueList tickets={ticketsShownInQueue} updateStatus={this.updateStatus}/>
                </Container>
            )
        } else {
            return null
        }

    }
}