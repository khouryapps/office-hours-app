import {makeRequest} from "../utils";

export const apiFetchStudentCourseList = async () => {
    const response = await makeRequest({method: 'GET', url: 'officehours/me/'});
    console.log('Fetched student courses:', response)
    return response
}

export const apiUpdateStudentCourseList = async (method_type, course_name) => {
    const response = await makeRequest({
            method: method_type,
            url: 'officehours/courses/',
            body: JSON.stringify({course: course_name})
        }
    )
    console.log('Updated student course list:', response)
    return response
}
