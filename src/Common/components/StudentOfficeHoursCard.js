import React from 'react';
import moment from 'moment';
import { Card, WhiteSpace } from '@ant-design/react-native';
import {View, StyleSheet} from "react-native";


const formatTime = (start, end) => {
    return (moment.parseZone(start).format('h:mm') + "-" + moment.parseZone(end).format('h:mm a'))
}

const StudentOfficeHoursCard = (props) => {
        const {ta_name, ta_photo, start, end, room, queue} = props;

        return (<View>
                    <WhiteSpace size="sm" />
                    <Card style={queue !== null && styles.openQueue}>
                        <Card.Header
                            title={ta_name}
                            thumbStyle={{ width: 60, height: 60 }}
                            thumb={ta_photo}
                            extra={formatTime(start, end) + "\nRoom: " + room}
                        />
                    </Card>
                    {props.children}
            </View>
        );
}

const styles = StyleSheet.create({
    openQueue: {
        backgroundColor:  'rgba(40, 255, 35, 0.2)'
    }
})

export default StudentOfficeHoursCard;
