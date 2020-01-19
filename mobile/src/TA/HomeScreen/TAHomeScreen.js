import React from "react";
import {ScrollView, View, Text, AsyncStorage} from "react-native";
import {Button, Tabs, WingBlank} from "@ant-design/react-native"
import {apiFetchTADetails, apiFetchUpcomingOfficeHours, apiUpdateTAStatus} from "../api";

import TAOfficeHoursCard from '../../Common/components/TAOfficeHoursCard'
import Loading from "../../Common/components/Loading";
import HeaderButton from "../../Common/components/HeaderButton";
import styles from "../../Style";

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
                <HeaderButton navigation={navigation}/>
            ),
        }
    };

    componentDidMount = async () => {
        // const {data, error} = await apiFetchUpcomingOfficeHours()
        // this.setState({upcomingOfficeHours: data, fetch_error: error, loading: false})

        // const {data, error} = await apiFetchTADetails()  // TODO -- Changed to get this data from the local storage or shared component that fetches from the officehours/me (officehours/ta) endopoint
        // this.setState({courses: data})
        // await this.getUpcomingOfficeHours();
        const current_course_id = await AsyncStorage.getItem('last_visited_course_id');
        const {data, error} = await apiFetchUpcomingOfficeHours(current_course_id, 654)  // TODO -- Figure out how to always get info from the current semester, maybe using redux or a shared state component
        this.setState({upcomingOfficeHours: data, fetch_error: error, loading: false})
    }

    getUpcomingOfficeHours = async () => {
        // Maybe I could just pull the data from the Sidebar that contains the current course instead of all the TA data ?

        //Just pull from the "last_visited_course_id" in local storage
        for (course in this.state.courses) {
            const {data, error} = await apiFetchUpcomingOfficeHours(course.id, course.semester)  // TODO -- Figure out how to always get info form the current semester
            // FIXME -- Set the state for the office hours of all the TA's courses
            this.setState({upcomingOfficeHours: data, fetch_error: error, loading: false})
        }
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

        let filteredHours = upcomingOfficeHours

        if (interval !== "semester") {

            const intervals_to_num = {day: 1, week: 7};

            let now = new Date();

            let date_interval = new Date(now);
            date_interval.setDate(date_interval.getDate() + intervals_to_num[interval]);
            date_interval.setHours(0, 0, 0, 0);

            filteredHours = upcomingOfficeHours.filter(officeHourBlock => {
                const end_date = new Date(officeHourBlock.end)
                return (end_date <= date_interval)
            })
        }


        if (filteredHours.length) {
            return (filteredHours.map((el, index) => (<TAOfficeHoursCard key={index} id={el.id} index={index} {...el}>
                {index === 0 && interval === 'day' ?
                    <Button type="ghost" onPress={this.taArrived}>
                        <Text>I AM HERE</Text>
                    </Button>
                    : null}
            </TAOfficeHoursCard>)))
        } else {
            return (<Text style={styles.headline}>No upcoming office hours for the {interval}</Text>)
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
                    <View style={{flex: 1}}>
                        <Tabs tabs={[{title: "Today"}, {title: "This Week"}, {title: "All"}]}>
                            <WingBlank size="sm">
                                <ScrollView style={styles.scrollViewStyle}>
                                    {this.filterHours('day')}
                                </ScrollView>
                            </WingBlank>
                            <WingBlank size="sm">
                                <ScrollView>
                                    {this.filterHours('week')}
                                </ScrollView>
                            </WingBlank>
                            <WingBlank size="sm">
                                <ScrollView>
                                    {this.filterHours('semester')}
                                </ScrollView>
                            </WingBlank>
                        </Tabs>
                    </View>
                );
            } else {
                console.log("Went straight to queue: ", upcomingOfficeHours[0].queue)
                this.props.navigation.navigate('TAQueueScreen',
                    {
                        queue_id: upcomingOfficeHours[0].queue,
                        office_hours_id: upcomingOfficeHours[0].id,
                        'taDeparted': this.taDeparted
                    })
                return <Loading/>
            }
        } else {
            return <Loading/>
        }
    }
}

