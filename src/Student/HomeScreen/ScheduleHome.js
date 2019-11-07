import React from "react";
import {AsyncStorage, View, Text, ScrollView} from 'react-native';

import {withNavigation} from 'react-navigation';

import OfficeHoursSchedule from './OfficeHoursSchedule'
import {apiFetchOfficeHoursSchedule} from "../api";
import HeaderButton from "../../Common/components/HeaderButton";
import Loading from "../../Common/components/Loading";
import {Button, WhiteSpace} from "@ant-design/react-native";
import RefreshButton from "../../Common/components/RefreshButton";


class ScheduleHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course_name: null,
            course_id: null,
            office_hours: [],
            fetch_error: null,
            loading: true,
            open_queue_id: null
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('course_name'),
            headerLeft: () => (
                <HeaderButton navigation={navigation}/>
            ),
            headerRight: (
                <RefreshButton navigation={navigation}/>
            ),
        }
    };

    componentDidMount = async () => {
        let course_name = await AsyncStorage.getItem("last_visited_course_name")
        // Line below sets the navigation param so that the course name can be picked up my the header in the navigation options
        this.props.navigation.setParams({'course_name': course_name})
        this.props.navigation.setParams({ 'refreshFetch': this.fetchOfficeHoursSchedule });
        let course_id = await AsyncStorage.getItem("last_visited_course_id")
        this.setState({
            course_name: course_name,
            course_id: course_id,
        }, () => {
            this.fetchOfficeHoursSchedule()
        });
    }

    getOpenQueue = () => {
        const {office_hours} = this.state
        // first filter by office hours that are scheduled for today

        let day_end = new Date();
        day_end.setHours(23,59,59,999);

        const todays_schedule = [];
        for (var i = 0; i < office_hours.length; i++) {
            let hours = office_hours[i]
            if (new Date(hours.start).getTime() < day_end.getTime()) {  // Check if the office hours are occurring today
                if (hours.queue !== null) {
                    this.setState({open_queue_id: hours.queue});
                }
            } else {
                // Since the array is sorted we can leave the loop after the first office hours we see from the next day
                return null;
            }
        }
    }


    fetchOfficeHoursSchedule = async () => {
        const course_id = this.state.course_id
        if (course_id) {
            const {data, error} = await apiFetchOfficeHoursSchedule(course_id);
            this.setState({office_hours: data, fetch_error: error, loading: false, open_queue_id: null});
        }
        this.getOpenQueue()
    }


    checkForRefetch = () => {
        let course_id = this.props.navigation.getParam('course_id')
        let course_name = this.props.navigation.getParam('course_name')

        if ((course_id && course_id !== this.state.course_id) ||
            (course_id && course_name !== this.state.course_name)) {
            this.setState({
                course_id: this.props.navigation.getParam('course_id'),
                course_name: this.props.navigation.getParam('course_name'),
                loading: true,
            }, () => {
                this.fetchOfficeHoursSchedule()
            })
        }
    }


    render() {
        const {loading, fetch_error, office_hours, course_name, course_id, open_queue_id} = this.state

        if (!loading && !fetch_error) {
            this.checkForRefetch();

            return (
                <View style={{flex: 1}}>
                    <ScrollView>
                        <OfficeHoursSchedule course_name={course_name} course_id={course_id}
                                             office_hours={office_hours}/>
                    </ScrollView>
                    <View>
                        <Button type="primary" disabled={!open_queue_id} onPress={() => this.props.navigation.navigate('StudentQueue', {queue_id: open_queue_id})}>
                            Join Queue
                        </Button>
                        <WhiteSpace/>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <Loading/>
                    {fetch_error ? <Text>{fetch_error.stack}</Text> : null}
                </View>
            )
        }
    }
}

export default withNavigation(ScheduleHome)

