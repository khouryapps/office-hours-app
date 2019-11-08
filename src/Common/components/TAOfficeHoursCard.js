import React from 'react';
import moment from 'moment';
import { Card, WhiteSpace } from '@ant-design/react-native';
import {View, StyleSheet} from "react-native";


const formatTime = (start, end) => {
    return (moment.parseZone(start).format('MMM Do') + '\n' + moment.parseZone(start).format('h:mm') + "-" + moment.parseZone(end).format('h:mm a'))
}

const TAOfficeHoursCard = (props) => {
    const {start, end, room} = props;

    return (<View>
            <WhiteSpace size="sm" />
            <Card>
                <Card.Header
                    title={formatTime(start, end)}
                    extra={"Room: " + room}
                />
            </Card>
        </View>
    );
}


export default TAOfficeHoursCard;
