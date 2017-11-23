export default class RequestsAPI {

    static getRequests() {
        return fetch(
            `http://` + `192.168.4.2` + `:3004/requests`,
            // `http://` + `192.168.0.181` + `:3004/requests`,
            {
                method: 'GET'
            })
            .then((response) => {
                if (response.status === 200) {
                    try {
                        return response.json();
                    } catch (e) {
                        console.log("Unable to parse response: " + response, e);
                        return null;
                    }
                }
                console.log("response: " + JSON.stringify(response));
                return null;
            });
    }

    static getRequestsById(id) {
        return fetch(
            `http://` + `192.168.4.2` + `:3004/requests/${id}`,
            // `http://` + `192.168.0.181` + `:3004/requests/${id}`,
            {
                method: 'GET'
            })
            .then((response) => {
                if (response.status === 200) {
                    try {
                        return response.json();
                    } catch (e) {
                        console.log("Unable to parse response: " + response, e);
                        return null;
                    }
                }
                console.log("response: " + JSON.stringify(response));
                return null;
            })
    }
}
