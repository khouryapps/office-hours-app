import React from 'react';
import {Button, Card, Text} from "native-base";
import moment from 'moment';



class OfficeHoursCard extends React.Component {
    render() {
        const {ta_name, start, end, room, index} = this.props;
        return (
            <Card>
                <Text>TA: {ta_name}</Text>
                <Text>Start: {moment(start).format('h:mm a, MMMM Do')}</Text>
                <Text>End: {moment(end).format('h:mm a, MMMM Do')}</Text>
                <Text>Room: {room}</Text>
                {this.props.children}
            </Card>)
    }
}

export default OfficeHoursCard;
