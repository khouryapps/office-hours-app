import {makeRequest} from '../utils'

export const fetchCourseSchedule = async (course_id) => {
    const response = await makeRequest('GET', 'officehours/schedule/', query_params={"course_id": course_id})
    console.log('Fetched office hours schedule:', response)
    return response

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
    const response = await makeRequest('GET', 'officehours/me/');
    console.log('Fetched student courses:', response)
    return response
}

