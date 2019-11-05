import {makeRequest} from '../utils'

export const apiFetchOfficeHoursSchedule = async (course_id) => {
    const response = await makeRequest({method: 'GET', url: 'officehours/schedule/', query_params: {"course_id": course_id}})
    console.log('Fetched office hours schedule:', response)
    return response
}


export const apiEditTicket = async (ticket_id, question_text) => {
    const response = await makeRequest({
        method: 'PATCH',
        url: 'officehours/ticket/edit/'+ ticket_id + '/',
        body: {
            "question": question_text,
        }
    })

    console.log("apiEdit Ticket response", response)
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