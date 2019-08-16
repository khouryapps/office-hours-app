import React from 'react'
import {Text, View, Card} from 'native-base'
import {ScrollView} from 'react-native';
import moment from 'moment'
import OfficeHoursCard from "../../Common/components/OfficeHoursCard";


class GroupedOfficeHours extends React.Component {
    state = {
        officeHours: [],
        loading: true,
        groups: {}
    };

    async componentDidMount() {

        try {
            //Assign the promise unresolved first then get the data using the json method.
            const apiCall = await fetch('http://127.0.0.1:8002/api/officehours/schedule/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9",
                }});

            const officeHours = await apiCall.json();
            this.setState({officeHours: officeHours, loading: false});
            console.log('office hours', officeHours)
            this.representHours()
        } catch (err) {
            console.log("Error fetching office hours", err);
        }
    }

    representHours = () => {
        const {officeHours} = this.state;
        const sorted = officeHours.sort((a, b) => {
            return moment(a.start) > moment(b.start)
        });

        let groupId = 0;
        const groups = {};
        sorted.forEach(hours => {
            if (groups[groupId] &&
                (moment(hours.start) > moment(groups[groupId].start)
                    && moment(hours.end) < moment(groups[groupId].end))) {
                groups[groupId].push(hours);
            }

            groupId++;
            groups[groupId] = [hours]
        });
        this.setState({groups})
    };

    render() {
        this.representHours();
        const {groups} = this.state;

        const keys = Object.keys(groups);

        return <ScrollView>
            {keys.map(k => <View>
                <Text style={{fontSize: 20}}>{moment(groups[k][0].start).format('MMMM Do, h:mm a')}</Text>
            {groups[k].map((el, index) => (<OfficeHoursCard key={index} id={el.id} index={index}
                                                            updateStatus={this.updateTAStatus} {...el}/>))}
            </View>)}
            </ScrollView>
    }
}

export default GroupedOfficeHours;