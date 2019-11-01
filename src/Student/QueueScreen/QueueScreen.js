import React from "react"
import HeaderButton from "../../Common/components/HeaderButton";
import RefreshButton from "../../Common/components/RefreshButton";
import {View, Text, StyleSheet} from "react-native";
import {Button, InputItem, WhiteSpace} from "@ant-design/react-native"
import {apiEditTicket, apiCreateTicket} from "../api";
import Loading from "../../Common/components/Loading";

export default class QueueScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queue_id: null,
            queue_size: null,
            queue_position: null,
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

    componentDidMount = () => {
        // TODO -- Create an on navigated handler that will add the queue_id to the state

        // Add mock data, then hook into api later
        const ticket = {
            "id": 83,
            "creator": {
                "user": "willstenzel",
                "full_name": "Will Stenzel",
                "photo_url": "https://prod-web.neu.edu/wasapp/EnterprisePhotoService/PhotoServlet?vid=CCS&er=1a0dbdb53563b28b447a0fe1bda157cefd5ef9fabe7ea5daec59666e00eb0b05454f4aa1a569b8550e4e93a1eb75a1e1c492a55e23895a69"
            },
            "group": null,
            "question": "Recursion is confusing me",
            "tags": [],
            "queue": 32,
            "ta_helped": null,
            "public": false,
            "created_on": "2019-10-30T16:24:29.999209-04:00",
            "opened_on": null,
            "closed_on": null,
            "status": "Open"
        }
        this.setState({
            queue_id: 31,
            queue_size: 3,
            student_ticket: null,
            question_text: "",
            // student_ticket: ticket,
            // question_text: ticket.question,
            queue_position: 3,
            loading: false
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
        const {loading, student_ticket, queue_position, queue_size, edit_question, question_text} = this.state

        if (loading) {
            return <Loading/>
        }
        if (student_ticket) {  // Show the students position in the queue
            return (
                <View>
                    <QueueInfo text={"Current queue position"} value={queue_position}/>
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
        } else {
            // Show the queue size and give the student the opportunity to add a question
            return (
                <View>
                    <QueueInfo text={"Current queue size"} value={queue_size}/>
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
