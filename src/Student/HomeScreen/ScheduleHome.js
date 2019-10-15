import React from "react";
import {AsyncStorage} from "react-native";
import {
    Button,
    Container,
    Body,
    Header,
    Title,
    Text,
    Left,
    Icon,
    Right,
} from "native-base";
import {withNavigation} from 'react-navigation';

import OfficeHoursSchedule from './OfficeHoursSchedule'
import {apiFetchOfficeHoursSchedule} from "../api";


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

    componentDidMount = async () => {
        let course_name = await AsyncStorage.getItem("last_visited_course_name")
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
        const {loading, office_hours, course_name, course_id} = this.state

        if (!loading) {
            this.checkForRefetch();

            return (
                <Container>
                    <Header>
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}
                            >
                                <Icon name="menu"/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>{course_name}</Title>
                        </Body>
                        <Right/>
                    </Header>
                    <OfficeHoursSchedule course_name={course_name} course_id={course_id} office_hours={office_hours}/>
                </Container>
            );
        } else {
            return <Header><Text>Loading...</Text></Header>
        }
    }
}

export default withNavigation(ScheduleHome)