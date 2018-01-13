import {ip} from "./api";

export default class RequestsAPI {

    static getRequests() {
        return fetch(
            `http://` + `${ip}` + `:3004/requests`,
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
            `http://` + `${ip}` + `:3004/requests/${id}`,
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

    static getRequestTypes() {
        return fetch(
            `http://` + `${ip}` + `:3004/requestTypes`,
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
