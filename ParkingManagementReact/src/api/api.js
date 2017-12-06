export const apiUrl = 'http://localhost:8181/';
export const headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
export const authHeaders = (token) => ({...headers, 'x-auth-token': `${token}`});