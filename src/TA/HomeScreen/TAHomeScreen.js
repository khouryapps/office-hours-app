import React from "react";
import moment from 'moment'

import {Container, Header, Left, Right, Body, Button, Icon, Title, Text, Card, Tabs, Tab} from 'native-base';
import {AsyncStorage, ScrollView} from "react-native";
import OfficeHoursCard from '../../Common/components/OfficeHoursCard'
import {fetchUpcomingOfficeHours} from "../api";

export default class TAHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true}
    }

    async componentDidMount() {
        const {data, error} = await fetchUpcomingOfficeHours()
        this.setState({upcomingOfficeHours: data, fetch_error: error, loading: false})
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
                    const queue_id = responseJson.id
                    this.props.navigation.navigate('TAQueueScreen',
                        {
                            queue_id: queue_id,
                            show_modal: true,
                            'updateTAStatus': this.updateTAStatus,
                        })
                    console.log('finished navigating to queue screen ')
                }
                this.fetchUpcomingOfficeHours() // figure out why this only works here and not above the this.props.navigation.navigate
            });
    }

    filterHours = (interval) => {
        const {upcomingOfficeHours} = this.state;

        if (interval === "all") {
            if (upcomingOfficeHours.length) {
                return (upcomingOfficeHours.map((el, index) => (<OfficeHoursCard key={index} id={el.id} index={index}
                                                                                 updateStatus={this.updateTAStatus} {...el}>
                    {index === 0 ?
                    <Button onPress={() => this.updateTAStatus('arrived')}>
                        <Text>I AM HERE</Text>
                    </Button>
                    : null}
                </OfficeHoursCard>)))
            } else {
                return (<Text>You have no upcoming office hours</Text>)
            }
        }

        const intervals_to_num = {day: 1, week: 7};

        let now = new Date();

        let date_interval = new Date(now);
        date_interval.setDate(date_interval.getDate() + intervals_to_num[interval]);
        date_interval.setHours(0, 0, 0, 0);


        const filteredHours = upcomingOfficeHours.filter(officeHourBlock => {
            const end_date = new Date(officeHourBlock.end)
            return (end_date < date_interval)
        })
        if (filteredHours.length) {
            return (filteredHours.map((el, index) => (<OfficeHoursCard key={index} id={el.id} index={index}
                                                                       updateStatus={this.updateTAStatus} {...el}>
                {index === 0 ?
                    <Button onPress={() => this.updateTAStatus('arrived')}>
                        <Text>I AM HERE</Text>
                    </Button>
                    : null}
            </OfficeHoursCard>)))
        } else {
            return (<Text>You have no upcoming office hours for the {interval}</Text>)
        }

    }

    hasCurrentlyOpenOfficeHours = () => {
        const {upcomingOfficeHours} = this.state;
        return upcomingOfficeHours.length && upcomingOfficeHours[0].queue !== null
    }

    render() {
        const {loading, upcomingOfficeHours} = this.state;
        if (!loading) {
            if (!this.hasCurrentlyOpenOfficeHours()) {
                return (
                    <Container>
                        <Header hasTabs>
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
                        <Tabs>
                            <Tab heading="Today">
                                <ScrollView>
                                    {this.filterHours('day')}
                                </ScrollView>
                            </Tab>
                            <Tab heading="This Week">
                                <ScrollView>
                                    {this.filterHours('week')}
                                </ScrollView>
                            </Tab>
                            <Tab heading="All">
                                <ScrollView>
                                    {this.filterHours('all')}
                                </ScrollView>
                            </Tab>
                        </Tabs>
                    </Container>
                );
            } else {
                console.log("Went straight to queue")
                this.props.navigation.navigate('TAQueueScreen',
                    {
                        'updateStatus': this.updateTAStatus,
                        queue_id: upcomingOfficeHours[0].queue
                    })
                return null
            }
        } else {
            return null
        }
    }
}

