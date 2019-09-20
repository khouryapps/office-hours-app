import axios from 'axios';
import {generateRequest} from '../utils'

export const fetchCourseSchedule = async (course_id) => {
    const request = generateRequest('GET', 'officehours/schedule/', query_params={"course_id": course_id})
    console.log('request', request)

    try {
        const response = await axios(request)
        console.log('Fetched office hours schedule:', response.data)
        return {officeHours: response.data, error: ""}
    } catch (error) {
        console.log("Error fetching office hours schedule:", error);
        return {officeHours: [], error: error}
    }

    // Q: Why doesn't think return the promise correctly?
    // await axios(options)
    //     .then(response => {
    //         console.log('Fetched office hours schedule:', response.data)
    //         return {officeHours: response.data, error: ""}
    //     })
    //     .catch(error => {
    //         console.log("Error fetching office hours schedule:", error);
    //         return {officeHours: null, error: error}
    //     });
}



export const fetchStudentCourseList = async () => {
    const request = generateRequest('GET', 'officehours/me/');

    try {
        const response = await axios(request);
        console.log('Fetched student courses:', response.data)
        return {courses: response.data.courses, full_name: response.data.full_name, error: ""}
    } catch (error) {
        console.log("Error student courses:", error);
        return {courses: [], student_name: "", error: error}
    }
}

