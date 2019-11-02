import React from "react"
import HeaderButton from "../../Common/components/HeaderButton";
import RefreshButton from "../../Common/components/RefreshButton";
import {View, Text, StyleSheet, AsyncStorage} from "react-native";
import {Button, InputItem, WhiteSpace} from "@ant-design/react-native"
import {apiEditTicket, apiCreateTicket} from "../api";
import Loading from "../../Common/components/Loading";
import {apiFetchQueueData} from "../../TA/api";

export default class QueueScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queue_id: null,
            queue_size: null,
            queue_position: null,
            tickets: null,
            student_ticket: null,
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
        // TODO -- Create an on navigated handler that will add the queue_id to the state whenever the page is navigated to
        this.props.navigation.setParams({ 'refreshFetch': this.fetchQueueData });
        const queue_id = await this.props.navigation.getParam('queue_id', null);
        this.setState({queue_id: queue_id})
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
        this.getStudentTicket()
    }


    getStudentTicket = async () => {
        const {tickets} = this.state
        const my_username = await AsyncStorage.getItem('username');

        for (let i = 0; i < tickets.length; i++) {
            let ticket = tickets[i];
            if (ticket.creator.user === my_username) {
                this.setState({
                    student_ticket: ticket,
                    question_text: ticket.question
                });
                return;
            }
        }
        this.setState({
            student_ticket: null,
            question_text: ""
        })
    }

    editStudentTicket = async () => {
        const {student_ticket, question_text} = this.state
        const {data, error} = await apiEditTicket(student_ticket.id, question_text)
        this.setState({student_ticket: data, edit_question: false})
    }

    createTicket = async () => {
        const {question_text, queue_id} = this.state
        const {data, error} = await apiCreateTicket(question_text, queue_id)
        this.setState({student_ticket: data, question_text: data.question, edit_question: false})
    }

    render() {
        const {loading, tickets, student_ticket, queue_position, queue_size, edit_question, question_text} = this.state

        if (loading) {
            return <Loading/>
        }
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
                                       value={question_text}
                                       onChange={value => {
                                           this.setState({
                                               question_text: value,
                                           })
                                       }}
                                       editable={edit_question}/>
                            {edit_question ?
                                <View><Button
                                    onPress={() => this.setState({edit_question: false})}>Cancel</Button><Button
                                    onPress={this.editStudentTicket}>Update</Button></View> :
                                <Button onPress={() => this.setState({edit_question: true})}>Edit</Button>}
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
