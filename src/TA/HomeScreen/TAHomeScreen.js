import React from "react";
import Moment from 'moment'

import {Container, Header, Left, Right, Body, Button, Icon, Title, Text, Card} from 'native-base';
import {AsyncStorage} from "react-native";
//import { Schedule } from '../../Student/HomeScreen/Schedule'

export default class TAHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true}
    }


    componentDidMount() {
        console.log("rendering TA Home Screen")
        this.fetchUpcomingOfficeHours()
    }

    fetchUpcomingOfficeHours = () => {
        fetch('http://127.0.0.1:8002/api/officehours/schedule/upcoming/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9",
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    upcomingOfficeHours: responseJson,
                }, function () {
                    console.log("upcoming offfice hours, ", responseJson)
                });
            })
            .catch((error) => {
                console.error("Error retrieving upcoming office hours", error);
            });
    }

    updateTAStatus = new_status => {
        fetch('http://127.0.0.1:8002/api/officehours/changestatus/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9",
            },
            body: JSON.stringify({
                office_hours_id: this.state.upcomingOfficeHours[0].id, // fix this to check if there are any upcoming office hours
                status: new_status,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (new_status === 'arrived') {
                    queue_id = responseJson.id
                    this.props.navigation.navigate('TAQueueScreen',
                        {
                            queue_id: queue_id,
                            show_modal: true,
                            'updateStatus': this.updateTAStatus,
                        })
                    console.log('finished navigating to queue screen ')
                }
                this.fetchUpcomingOfficeHours() // figure out why this only works here and not above the this.props.navigation.navigate 
            });
    }

    render() {
        const {isLoading, upcomingOfficeHours} = this.state;
        if (!isLoading) {
                if (nextOfficeHours.queue == null) {
                    return (
                        <Container>
                            <Header>
                                <Left>
                                    <Button
                                        transparent
                                        onPress={() => this.props.navigation.openDrawer()}>
                                        <Icon name="menu"/>
                                    </Button>
                                </Left>
                                <Body>
                                    <Title>TA Office Hours</Title>
                                </Body>
                                <Right/>
                            </Header>
                            { upcomingOfficeHours.length ?
                                upcomingOfficeHours.map((el, index) => (<OfficeHoursCard key={index} id={el.id} index={index} {...el}/>))
                            : <Text>You have no upcoming office hours</Text>}
                        </Container>
                    );
                } else {
                    console.log("Went straight to queue")
                    this.props.navigation.navigate('TAQueueScreen',
                        {
                            'updateStatus': this.updateTAStatus,
                            queue_id: nextOfficeHours.queue
                        })
                    return null
                }
        } else {
            return null
        }
    }
}

class OfficeHoursCard extends React.Component {
    render() {
        const {ta_name, start, end, room, index} = this.props;
            console.log("index", index);
        return (
            <Card>
                <Text>TA: {ta_name}</Text>
                <Text>Start: {Moment(start).format('h:mm a, MMMM Do')}</Text>
                <Text>End: {Moment(end).format('h:mm a, MMMM Do')}</Text>
                <Text> Room: {room}</Text>
                {index === 0 ?
                    <Button onPress={() => this.updateTAStatus("arrived")}>
                        <Text>I AM HERE</Text>
                    </Button>
                : null}
            </Card>)

    }
}