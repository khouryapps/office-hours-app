import {makeRequest} from '../utils'


// NOTE - All functions start with api prefix to distinguish between the functions
// being used in the component and the functions in this file

export const apiFetchTADetails = async () => {
    const response = await makeRequest({method: 'GET', url: 'officehours/ta/'})
    console.log('Fetched TA data:', response)
    return response;
}

export const apiFetchUpcomingOfficeHours = async (course_id, semester_id) => {
    const response = await makeRequest({method: 'GET', url: 'officehours/schedule/?course_id=' + course_id + '&semester_id=' + semester_id + '&is_ta=true'})
    // Filter the schedule for only the TA's hours

    console.log('Fetched TA schedule:', response)
    return response;
}

export const apiUpdateTAStatus = async (office_hours_id, new_status) => {

    const response = await makeRequest({
        method: 'PATCH',
        url: 'officehours/changestatus/',
        body: {
            "office_hours_id": office_hours_id,
            "status": new_status,
        }
    })

    console.log("Update TA status response", response)
    return response
}


export const apiFetchQueueData = async (queue_id) => {

    const response = await makeRequest({
        method: 'GET',
        url: 'officehours/queue/'+queue_id+'/'
    })

    console.log('Fetched Queue Data:', response)
    return response
}


export const apiUpdateTicket = async (ticket_id, new_status) => {

     const response = await makeRequest({
         method: 'PATCH',
         url: 'officehours/ticket/' + ticket_id + '/edit/',
         body: {
             "status": new_status
         }
     })

    console.log('Updated Ticket Status:', response)
    return response
}




