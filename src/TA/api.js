import axios from 'axios';
import {makeRequest} from '../utils'


export const fetchUpcomingOfficeHours = async () => {
    const response = await makeRequest('GET', 'officehours/schedule/upcoming/')
    console.log('Fetched TA schedule:', response)
    return response;
}
