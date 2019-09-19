import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8002/api/';

const HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9"
}

export const generateRequest = (method, url, query_params={}, body={}) => {
    let full_url = BASE_URL + url
    if (query_params) {
        full_url += "?"
        for (let key in query_params) {
            full_url += key + "=" + query_params[key]
        }
    }

    return {
        method: method,
        url: full_url,
        headers: HEADERS,
        data: body,
    };

}

export const getCourseSchedule = async (course_id) => {
    let url = BASE_URL + 'officehours/schedule/?course_id=' + course_id;
    let options = {
        method: 'GET',
        url: url,
        headers: HEADERS
    };

    await axios(options)
        .then(function (response) {
            console.log('Fetched office hours schedule:', response.data)
            return {officeHours: response.data, error: ""}
        })
        .catch(function (error) {
            console.log("Error fetching office hours schedule:", error);
            return {officeHours: null, error: error}
        });
}


//
// try {
//     const apiCall = await fetch(BASE_URL + 'officehours/schedule/?course_id=' + course_id, {
//         method: 'GET',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': "Token a891e91d45001088b201b3c2ebe8a5e87a9121f9",
//         }
//     });
//
//     const officeHours = await apiCall.json();
//     console.log('office hours', officeHours)
//     return officeHours
// } catch (err) {
//     console.log("Error fetching office hours", err);
// }

export default getCourseSchedule;