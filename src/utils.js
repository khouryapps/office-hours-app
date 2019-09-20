
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