export default class RequestsAPI {

    static getRequests() {
        return fetch(
            `http://` + `192.168.0.181` + `:3004/requests`,
            {
                method: 'GET'
            })
            .then((response) => {
                if (!response.ok){
                    throw ('Error');
                }
                return response.json();
            });
    }

    static getRequestsById(id) {
        return fetch(
            `http://` + `192.168.0.181` + `:3004/requests/${id}`,
            {
                method: 'GET'
            })
            .then((response) => {
                if (!response.ok){
                    throw ('Error');
                }
                return response.json();
            });
    }
}
