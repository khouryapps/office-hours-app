import React from "react";
import moment from 'moment'

import {Container, Header, Left, Right, Body, Button, Icon, Title, Text, Card, Tabs, Tab} from 'native-base';
import {AsyncStorage, ScrollView} from "react-native";
import OfficeHoursCard from '../../Common/components/OfficeHoursCard'
import {apiFetchUpcomingOfficeHours, apiUpdateTAStatus} from "../api";

export default class TAHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            fetch_error: null
        }
    }

    componentDidMount = async () => {
        const {data, error} = await apiFetchUpcomingOfficeHours()
        this.setState({upcomingOfficeHours: data, fetch_error: error, loading: false})
    }

    taDeparted = async () => {
        const current_office_hours_id = this.state.upcomingOfficeHours[0].id
        let data, error;
        let update_status_response = await apiUpdateTAStatus(current_office_hours_id, 'departed')
        // FIXME -- Is there a way to declare "const {data, error}" twice in one function?
        data = update_status_response.data;
        error = update_status_response.error;
        console.log("taDeparted data:", data)
        this.setState({fetch_error: error})
        this.props.navigation.navigate('TAHome')
        let upcoming_hours_response = await apiFetchUpcomingOfficeHours()
        data = upcoming_hours_response.data
        error = upcoming_hours_response.error
        this.setState({upcomingOfficeHours: data, fetch_error: error, loading: false})
    }

    taArrived = async () => {
        const current_office_hours_id = this.state.upcomingOfficeHours[0].id
        const {data, error} = await apiUpdateTAStatus(current_office_hours_id, 'arrived')
        console.log("taArrived data:", data)
        const queue_id = data.id
        this.props.navigation.navigate('TAQueueScreen',
            {
                queue_id: queue_id,
                office_hours_id: current_office_hours_id,
                'taDeparted': this.taDeparted,
            })
        this.setState({loading: true})
    }

    filterHours = (interval) => {
        const {upcomingOfficeHours} = this.state;

        if (interval === "all") {
            if (upcomingOfficeHours.length) {
                return (upcomingOfficeHours.map((el, index) => (
                    <OfficeHoursCard key={index} id={el.id} index={index} {...el}>
                        {index === 0 ?
                            <Button onPress={this.taArrived}>
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
            return (filteredHours.map((el, index) => (<OfficeHoursCard key={index} id={el.id} index={index} {...el}>
                {index === 0 ?
                    <Button onPress={this.taArrived}>
                        <Text>I AM HERE</Text>
                    </Button>
                    : null}
            </OfficeHoursCard>)))
        } else {
            return (<Text>You have no upcoming office hours for the {interval}</Text>)
        }

    }

    hasCurrentlyOpenOfficeHours = () => {
        console.log("home screeen state", this.state);
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
                        queue_id: upcomingOfficeHours[0].queue,
                        office_hours_id: upcomingOfficeHours[0].id,
                        'taDeparted': this.taDeparted
                    })
                return null
            }
        } else {
            return <Header><Text>Loading</Text></Header>
        }
    }
}

