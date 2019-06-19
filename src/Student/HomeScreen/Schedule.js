import React from 'react'
import {Text, Container, Card} from 'native-base'
import moment from 'moment'



class Schedule extends React.Component {
    render() {
        console.log(this.props);
        return(
            <Card>
                <Text>{this.props.ta_application.name}</Text>
                <Text>{this.props.start_time}-{this.props.end_time} - {this.props.room}</Text>
            </Card>
        )
    }

}

class JoinedOfficeHours extends React.Component {
    state = {
        groups: {}
    };

    componentDidMount() {
        this.representHours()
    }

    representHours = () => {
        const {officeHours} = this.props;
        const sorted = officeHours.sort((a, b) => {
            return moment(a.start_time) > moment(b.start_time)
        });

        let groupId = 0;
        const groups = {};
        sorted.forEach(hours => {
            if (groups[groupId] &&
                (moment(hours.start_time) > moment(groups[groupId].start_time)
                    && moment(hours.end_time) < moment(groups[groupId].end_time))) {
                groups[groupId].push(hours);
            }

            groupId++;
            groups[groupId] = [hours]
        });
        this.setState({groups})
        //here is going to be some filtering depending on the props
    };

    render() {
        const {groups} = this.state;

        const keys = Object.keys(groups);

        return <Container>
            {keys.map(k => <Container>
                <Text style={{fontSize: 20}}>{groups[k][0].start_time}</Text>
            {groups[k].map(el => <Schedule {...el}/>)}
            </Container>)}
            </Container>
    }
}

export default JoinedOfficeHours;