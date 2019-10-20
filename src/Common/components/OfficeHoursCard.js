import React from 'react';
import moment from 'moment';
import { Card, WhiteSpace, WingBlank } from '@ant-design/react-native';


const formatTime = (start, end) => {
    return (moment.parseZone(start).format('h:mm') + "-" + moment.parseZone(end).format('h:mm a'))
}

const OfficeHoursCard = (props) => {
        const {ta_name, ta_photo, start, end, room} = props;

        return (
                <WingBlank size="md">
                    <WhiteSpace size="sm" />
                    <Card>
                        <Card.Header
                            title={ta_name}
                            thumbStyle={{ width: 60, height: 60 }}
                            thumb={ta_photo}
                            extra={formatTime(start, end) + "\nRoom: " + room}
                        />
                    </Card>
                    {props.children}
                </WingBlank>
        );
}

export default OfficeHoursCard;
