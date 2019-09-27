import React from 'react'
import {Text, View, Card, Header} from 'native-base'
import {ScrollView} from 'react-native';
import {apiFetchCourseSchedule} from '../api';
import moment from 'moment'
import OfficeHoursCard from "../../Common/components/OfficeHoursCard";


class OfficeHoursSchedule extends React.Component {

    representHours = (office_hours) => {

        const grouped_hours = {};
        // Group the office hours for each day
        office_hours.map(hours => {
            if (!grouped_hours[moment(hours.start).date()]) {
                grouped_hours[moment(hours.start).date()] = [hours]
            } else {                grouped_hours[moment(hours.start).date()].push(hours)
            }
        })

        return grouped_hours
    };


    render() {
            const grouped_hours = this.representHours(this.props.office_hours)
            console.log("grouped hours", grouped_hours)
            const keys = Object.keys(grouped_hours);

            return <ScrollView>
                {keys.map((k, index) => <View key={index}>
                    <Text style={{fontSize: 20}}>{moment(grouped_hours[k][0].start).format('dddd, MMMM Do')}</Text>
                    {grouped_hours[k].map(el => (
                        <OfficeHoursCard key={el.id} id={el.id} index={index} {...el}/>))}
                </View>)}
            </ScrollView>
    }
}

export default OfficeHoursSchedule;