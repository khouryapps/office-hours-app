import React from "react";
import moment from 'moment'

import {Container, Header, Left, Right, Body, Button, Icon, Title, Text, Card} from 'native-base';
import {AsyncStorage} from "react-native";
//import { Schedule } from '../../Student/HomeScreen/Schedule'

export default class TAHomeScreen extends React.Component {
    constructor(props){
        super(props);
        this.state ={ isLoading: true }
    }

    componentDidMount(){
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
                    nextOfficeHours: responseJson[0],
                }, function(){
                console.log("next offfice hours, ", responseJson[0])
                });
            })
            .catch((error) =>{
                console.error("Error retrieving upcoming office hours", error);
            });
    }

    I_AM_HERE = () => {
        fetch('http://127.0.0.1:8002/api/officehours/changestatus/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9",
            },
            body: JSON.stringify({
                office_hours_id: this.state.nextOfficeHours.id,
                status: 'arrived',
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("im here response:", responseJson)
                queue_id = responseJson.id
                this.props.navigation.navigate('QueueScreen',
                    {
                        queue_id: queue_id,
                        show_modal: true
                    })
        });
    }

    render() {
        const {isLoading, nextOfficeHours} = this.state;
        console.log("state office hours", nextOfficeHours)
        if (!isLoading) {
            console.log("next office hours queue", nextOfficeHours.queue)
        }
         if ( !isLoading ) {
             if (nextOfficeHours.queue === null) {
                 return (
                     <Container>
                         <Header>
                             <Left>
                                 <Button transparent>
                                     <Icon name='menu'/>
                                 </Button>
                             </Left>
                             <Body>
                                 <Title>TA Overview</Title>
                             </Body>
                             <Right/>
                         </Header>
                         <Text>Upcoming Office Hours:</Text>
                         <Card>
                             <Text>TA: {nextOfficeHours.ta_name}</Text>
                             <Text>Start: {nextOfficeHours.start}</Text>
                             <Text>End: {(nextOfficeHours.end)}</Text>
                             <Text> Room: {nextOfficeHours.room}</Text>
                         </Card>
                         <Button onPress={this.I_AM_HERE}>
                             <Text>I AM HERE</Text>
                         </Button>
                     </Container>
                 );
             } else {
                 console.log("Went straight to queue")
                 this.props.navigation.navigate('QueueScreen')
                 return null
             }
         } else {
             return null
         }
    }
}