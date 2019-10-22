import React from "react";
import moment from 'moment'
import {AsyncStorage, ScrollView, View, Text} from "react-native";
import OfficeHoursCard from '../../Common/components/OfficeHoursCard'
import {apiFetchUpcomingOfficeHours, apiUpdateTAStatus} from "../api";

import {Container} from 'native-base';
import {Button, Tabs} from "@ant-design/react-native"

export default class TAHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            fetch_error: null
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'TA Home',
            headerLeft: () => (
                <Button
                    onPress={() => navigation.openDrawer()}><Text>*</Text></Button>
            ),
        }
    };

    componentDidMount = async () => {
        const {data, error} = await apiFetchUpcomingOfficeHours()
        this.setState({upcomingOfficeHours: data, fetch_error: error, loading: false})
    }

    taDeparted = async () => {
        const current_office_hours_id = this.state.upcomingOfficeHours[0].id
        const {data, error} = await apiUpdateTAStatus(current_office_hours_id, 'departed')
        this.props.navigation.navigate('TAHome')
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
                        <Tabs tabs={[{title: "Today"}, {title: "This Week"}, {title: "All"}]}>
                            <ScrollView>
                                {this.filterHours('day')}
                            </ScrollView>
                            <ScrollView>
                                {this.filterHours('week')}
                            </ScrollView>
                            <ScrollView>
                                {this.filterHours('all')}
                            </ScrollView>
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
            return <Text>Loading</Text>
        }
    }
}

