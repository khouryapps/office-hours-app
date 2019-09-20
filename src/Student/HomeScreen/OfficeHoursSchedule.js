import React from 'react'
import {Text, View, Card} from 'native-base'
import {ScrollView} from 'react-native';
import {fetchCourseSchedule, generateRequest} from '../api';
import moment from 'moment'
import OfficeHoursCard from "../../Common/components/OfficeHoursCard";
import axios from "axios";


class OfficeHoursSchedule extends React.Component {
    state = {
        course_id: null,
        officeHours: [],
        loading: true,
        fetch_error: null,
        groups: {}
    };

    async componentDidMount() {
        await this.fetchHours();
        // this.representHours()
    }

    fetchHours = async () => {
        const course_id = this.props.course_id
        this.setState({course_id: course_id})
        if (course_id) {
            const data = await fetchCourseSchedule(course_id);
            console.log("from schedule component", data)
            this.setState({officeHours: data.officeHours, fetch_error: data.error, loading: false});
        }
        this.representHours();  // Q: Why doesn't it render correctly without the represent hours here?
    }

    // fetchHours = async () => {
    //     const course_id = this.props.course_id
    //     this.setState({course_id: course_id})
    //     if (course_id) {
    //         const request = generateRequest('GET', 'officehours/schedule/', query_params={"course_id": course_id})
    //         console.log('request', request)
    //         // Q: Why is the await key word necessary here?
    //         await axios(request)
    //             .then(response => {
    //                 console.log("Fetched office hours data", response.data);
    //                 this.setState({officeHours: response.data, loading: false})
    //             })
    //             .catch(error => {
    //                 console.log("Error fetching office hours schedule:", error);
    //             });
    //     }
    // }

    representHours = () => {
        const {officeHours} = this.state;
        console.log("sorted", officeHours)

        let groupId = 0;
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
            this.fetchHours()
            // this.representHours()
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