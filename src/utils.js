import {AsyncStorage} from "react-native";
import axios from "axios";




export const generateRequest = async (method, url, query_params={}, body={}) => {
    const BASE_URL = 'http://127.0.0.1:8002/api/';

    const userToken = await AsyncStorage.getItem('userToken');

    const HEADERS = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + userToken
    }


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
        // data: body,
    };
}

export const makeRequest = async (method, url, query_params={}, body={}) => {
    const BASE_URL = 'http://127.0.0.1:8002/api/';

    const userToken = await AsyncStorage.getItem('userToken');

    const HEADERS = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + userToken
    }

    let full_url = BASE_URL + url

    if (query_params) {
        full_url += "?"
        for (let key in query_params) {
            full_url += key + "=" + query_params[key]
        }
    }

    const request =  {
        method: method,
        url: full_url,
        headers: HEADERS,
        // data: body,
    };

    try {
        const response = await axios(request)
        return {data: response.data, error: ""}
    } catch (error) {
        return {data: null, error: error}
    }
}