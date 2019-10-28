import React from "react";
import {AsyncStorage, View, Text} from 'react-native';

import {withNavigation} from 'react-navigation';

import OfficeHoursSchedule from './OfficeHoursSchedule'
import {apiFetchOfficeHoursSchedule} from "../api";
import HeaderButton from "../../Common/components/HeaderButton";
import Loading from "../../Common/components/Loading";


class ScheduleHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course_name: null,
            course_id: null,
            office_hours: [],
            fetch_error: null,
            loading: true,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('course_name'),
            headerLeft: () => (
                <HeaderButton navigation={navigation}/>
            ),
        }
    };

    componentDidMount = async () => {
        let course_name = await AsyncStorage.getItem("last_visited_course_name")
        // Line below sets the navigation param so that the course name can be picked up my the header in the navigation options
        this.props.navigation.setParams({'course_name': course_name})
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
            this.setState({office_hours: data, fetch_error: error, loading: false});
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
        const {loading, fetch_error, office_hours, course_name, course_id} = this.state

        if (!loading && !fetch_error) {
            this.checkForRefetch();

            return (
                <View>
                    <OfficeHoursSchedule course_name={course_name} course_id={course_id} office_hours={office_hours}/>
                </View>
            );
        } else {
            return (
                <View>
                    <Loading/>
                    {fetch_error ? <Text>{fetch_error.stack}</Text>: null}
                </View>
            )
        }
    }
}

export default withNavigation(ScheduleHome)

