import React from 'react'
import {Text, View, Card} from 'native-base'
import {ScrollView} from 'react-native';
import {apiFetchCourseSchedule} from '../api';
import moment from 'moment'
import OfficeHoursCard from "../../Common/components/OfficeHoursCard";


class OfficeHoursSchedule extends React.Component {
    state = {
        course_id: null,
        officeHours: [],
        loading: true,
        fetch_error: null,
        groups: {}
    };

    async componentDidMount() {
        await this.fetchCourseSchedule();
    }

    fetchCourseSchedule = async () => {
        const course_id = this.props.course_id
        this.setState({course_id: course_id})
        if (course_id) {
            const {data, error} = await apiFetchCourseSchedule(course_id);
            this.setState({officeHours: data, fetch_error: error, loading: false});
        }
        this.representHours();  // Q: Why doesn't it render correctly without the represent hours here?
    }


    representHours = () => {
        const {officeHours} = this.state;
        console.log("sorted", officeHours)

        const groups = {};
        // Group the office hours for each day
        officeHours.map(hours => {
            if (!groups[moment(hours.start).date()]) {
                groups[moment(hours.start).date()] = [hours]
            } else {                groups[moment(hours.start).date()].push(hours)
            }
        })

        this.setState({groups})
    };


    render() {
        if (this.props.course_id !== this.state.course_id) {
            this.fetchCourseSchedule()
        }
        const {groups} = this.state;
        const keys = Object.keys(groups);

        return <ScrollView>
            {keys.map(k => <View>
                <Text style={{fontSize: 20}}>{moment(groups[k][0].start).format('dddd, MMMM Do')}</Text>
            {groups[k].map((el, index) => (<OfficeHoursCard key={index} id={el.id} index={index} {...el}/>))}
            </View>)}
            </ScrollView>
    }
}

export default OfficeHoursSchedule;