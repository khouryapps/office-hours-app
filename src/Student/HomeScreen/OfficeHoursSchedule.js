import React from 'react'
import {Text, View, Card, Header} from 'native-base'
import {ScrollView} from 'react-native';
import moment from 'moment'
import OfficeHoursCard from "../../Common/components/OfficeHoursCard";


class OfficeHoursSchedule extends React.Component {

    representHours = (office_hours) => {
        const grouped_hours = {};
        // Group the office hours for each day
        office_hours.map(hours => {
            if (!grouped_hours[moment(hours.start)]) {
                grouped_hours[moment(hours.start)] = [hours]
            } else {
                grouped_hours[moment(hours.start)].push(hours)
            }
        })

        return grouped_hours
    };


    render() {
            const grouped_hours = this.representHours(this.props.office_hours)
            const start_times = Object.keys(grouped_hours);

            return <ScrollView>
                {start_times.map((start_time, index) => <View key={index}>
                    <Text style={{fontSize: 20}}>{moment(grouped_hours[start_time][0].start).format('dddd, MMMM Do')}</Text>
                    {grouped_hours[start_time].map(el => (
                        <OfficeHoursCard key={el.id} id={el.id} index={index} {...el}/>))}
                </View>)}
            </ScrollView>
    }
}

export default OfficeHoursSchedule;