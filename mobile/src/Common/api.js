import {makeRequest} from "../utils";

export const apiFetchUserDetails = async () => {
    const response = await makeRequest({method: 'GET', url: 'officehours/me/'});
    console.log('Fetched student courses:', response)
    return response
}

