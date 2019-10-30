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
        console.log("course_name component did mount", course_name)
        console.log("course_id component did mount", course_id)
        this.setState({
            course_name: course_name,
            course_id: course_id,
        }, () => {
            this.fetchOfficeHoursSchedule()
        });
    }


    fetchOfficeHoursSchedule = async () => {
        const course_id = this.state.course_id
        if (course_id) {
            const {data, error} = await apiFetchOfficeHoursSchedule(course_id);
            this.setState({office_hours: data.schedule, open_queue_id: data.queue_id, fetch_error: error, loading: false});
        }
    }


    checkForRefetch = () => {
        let course_id = this.props.navigation.getParam('course_id')
        let course_name = this.props.navigation.getParam('course_name')

        if ((course_id && course_id !== this.state.course_id) ||
            (course_id && course_name !== this.state.course_name)) {
            console.log("course changed!")
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
                        <Button type="primary" disabled={!open_queue_id} onPress={() => this.props.navigation.navigate('StudentQueue')}>
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

