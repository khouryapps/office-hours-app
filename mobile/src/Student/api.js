import {makeRequest} from '../utils'

export const apiFetchOfficeHoursSchedule = async (course_id) => {
    const response = await makeRequest({method: 'GET', url: 'officehours/schedule/', query_params: {"course_id": course_id}})
    console.log('Fetched office hours schedule:', response)
    return response
}


export const apiEditTicket = async (ticket_id, question_text) => {
    const response = await makeRequest({
        method: 'PATCH',
        url: 'officehours/ticket/'+ ticket_id + '/edit/',
        body: {
            "question": question_text,
        }
    })

    console.log("api Edit Ticket response", response)
    return response
}

export const apiDeleteTicket = async (ticket_id) => {
    const response = await makeRequest({
        method: 'PATCH',
        url: 'officehours/ticket/'+ ticket_id + '/edit/',
        body: {
            "deleted": true,
        }
    })

    console.log("api Delete Ticket response", response)
    return response
}

export const apiCreateTicket = async (question, queue_id) => {
    const response = await makeRequest({
        method: 'POST',
        url: 'officehours/ticket/',
        body: {
            "question": question,
            "queue": queue_id
        }
    })

    console.log("apiCreateTicket response", response)
    return response
}