import {makeRequest} from '../utils'

export const apiFetchCourseSchedule = async (course_id) => {
    const response = await makeRequest({method: 'GET', url: 'officehours/schedule/', query_params: {"course_id": course_id}})
    console.log('Fetched office hours schedule:', response)
    return response
}



