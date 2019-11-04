import React from "react"
import HeaderButton from "../../Common/components/HeaderButton";
import RefreshButton from "../../Common/components/RefreshButton";
import {View, ScrollView, Text, StyleSheet, AsyncStorage} from "react-native";
import {Button, InputItem, WhiteSpace} from "@ant-design/react-native"
import {apiEditTicket, apiCreateTicket} from "../api";
import Loading from "../../Common/components/Loading";
import {apiFetchQueueData} from "../../TA/api";

export default class QueueScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queue_id: null,
            tickets: [],
            edit_question: false,
            question_text: "",
            loading: true
        }
    }

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

    componentDidMount = async () => {
        const {navigation} = this.props
        navigation.setParams({'refreshFetch': this.fetchQueueData});
        const queue_id = await navigation.getParam('queue_id', null);
        const my_username = await AsyncStorage.getItem('username');
        this.setState({queue_id: queue_id, my_username: my_username})
        await this.fetchQueueData();
    }

    fetchQueueData = async () => {
        const {queue_id} = this.state

        const {data, error} = await apiFetchQueueData(queue_id)
        this.setState({
            tickets: data.tickets.filter(ticket => (ticket.status !== "Closed")),
            queue_id: queue_id,
            fetch_error: error,
            loading: false
        })
    }


    getStudentTicket = () => {
        const {tickets, my_username} = this.state

        for (let i = 0; i < tickets.length; i++) {
            let ticket = tickets[i];
            if (ticket.creator.user === my_username) {
                return ticket;
            }
        }
        return null;
    }

    updateQueueWithTicket(new_ticket) {
        const {tickets} = this.state
        let updated_tickets = tickets  // Question: Is this a bad way to update because it is mutating the data?
        for (let i = 0; i < updated_tickets.length; i++) {
            let ticket = updated_tickets[i];
            if (ticket.id === new_ticket.id) {
                updated_tickets[i] = new_ticket  // update the list of tickets with the new ticket
                this.setState({tickets: updated_tickets, edit_question: false, question_text: ""})
                return;
            }
        }
        // or add a new ticket to the end of the list
        updated_tickets.push(new_ticket);
        this.setState({tickets: updated_tickets, edit_question: false, question_text: ""});
    }

    editStudentTicket = async (student_ticket) => {
        const {question_text} = this.state
        const {data, error} = await apiEditTicket(student_ticket.id, question_text)
        this.updateQueueWithTicket(data)
    }

    createTicket = async () => {
        const {question_text, queue_id} = this.state
        const {data, error} = await apiCreateTicket(question_text, queue_id)
        this.updateQueueWithTicket(data)
    }

    renderPage = () => {
        const {tickets, edit_question, question_text} = this.state
        const student_ticket = this.getStudentTicket()

        if (student_ticket) {
            if (student_ticket.status === "In Progress") {  // Show Student that they are currently being helped
                return (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: '30%'}}>
                        <Text style={styles.textStyle}>Currently being helped by:</Text>
                        <WhiteSpace/>
                        <Text style={{fontSize: 24, alignSelf: 'center'}}>{student_ticket.ta_helped}</Text>
                    </View>)
            } else {   // Show the students position in the queue
                return (
                    <View>
                        <QueueInfo text={"Current queue position"} value={tickets.indexOf(student_ticket)}/>
                        <WhiteSpace/>
                        <View>
                            <Text style={styles.textStyle}>Question</Text>
                            <InputItem clear
                                       value={edit_question ? question_text : student_ticket.question}
                                       onChange={value => {
                                           this.setState({
                                               question_text: value,
                                           })
                                       }}
                                       editable={edit_question}/>
                            {edit_question ?
                                <View><Button
                                    onPress={() => this.setState({
                                        edit_question: false,
                                        question_text: ""
                                    })}>Cancel</Button><Button
                                    onPress={() => this.editStudentTicket(student_ticket)}>Update</Button></View> :
                                <Button onPress={() => this.setState({
                                    edit_question: true,
                                    question_text: student_ticket.question
                                })}>Edit</Button>}
                        </View>
                    </View>
                );
            }
        } else {
            // Show the queue size and give the student the opportunity to add a question
            return (
                <View>
                    <QueueInfo text={"Current queue size"} value={tickets.length}/>
                    <WhiteSpace/>
                    <View>
                        <Text style={styles.textStyle}>Add a new Question!</Text>
                        <InputItem clear
                                   value={question_text}
                                   onChange={value => {
                                       this.setState({
                                           question_text: value,
                                       })
                                   }}/>
                        <Button onPress={this.createTicket}>Submit</Button>
                    </View>
                </View>
            )
        }
    }

    render() {
        const {loading} = this.state
        if (loading) {
            return <Loading/>
        } else {
            return (
                <View style={{flex: 1}}>
                    <ScrollView>
                        {this.renderPage()}
                    </ScrollView>
                    <Button type="warning"
                            onPress={() => this.props.navigation.navigate('Schedule')}>
                        Leave Queue
                    </Button>
                    <WhiteSpace/>
                </View>
            )
        }
    }
}

const QueueInfo = (props) => {
    return (
        <View style={styles.queueInfo}>
            <Text>{props.text}</Text>
            <Text style={{fontSize: 50}}>{props.value}</Text>
        </View>)
}

const styles = StyleSheet.create({
    queueInfo: {
        paddingTop: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingLeft: '2%',
    }
})
