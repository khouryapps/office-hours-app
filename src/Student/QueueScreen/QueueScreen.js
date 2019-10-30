import React from "react"
import HeaderButton from "../../Common/components/HeaderButton";
import RefreshButton from "../../Common/components/RefreshButton";
import {View, Text} from "react-native";

export default class QueueScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queue_id: null,
            queue_position: null,
            student_ticket: null,
            edit_question: false,
            loading: true
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Queue Screen',
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
        this.setState({
            queue_id: 31,
            student_ticket: {
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
            },
            queue_position: 3,
            loading: false
        })
    }

    render() {
        const {student_ticket, queue_position} = this.state
        return (
            <View>
                <Text>Queue Screen</Text>
                <Text>Your queue position: {queue_position}</Text>
            </View>
        );
    }
}

