const apiUrl = "http://127.0.0.1:8000/api/";

function api(endpoint: string, method: string, body: string | null): Promise<Response> {
    const url = apiUrl + endpoint;

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    return fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: body ? body : null
    });
}

/* Jobs */

export async function apiGetJobs(): Promise<Response> {
    console.log("Sending request to get all jobs");
    return api('jobs', 'GET', null);
}
