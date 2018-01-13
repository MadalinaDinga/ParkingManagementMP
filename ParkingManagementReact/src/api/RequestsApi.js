import {ip} from "./api";
import {getLogger} from "../common/utils";

const log = getLogger('RequestsApi');

export default class RequestsAPI {

    static getRequests(authorization_credentials) {
        return fetch(
            //`http://` + `${ip}` + `:3004/requests`,
            `https://parking-django.herokuapp.com/requests/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':'Bearer ' + authorization_credentials
                }
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

    static getRequestsById(authorization_credentials, id) {
        return fetch(
            // `http://` + `${ip}` + `:3004/requests/${id}`,
            `https://parking-django.herokuapp.com/requests/1/`,
            {
                method: 'GET',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':'Bearer ' + authorization_credentials
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    try {
                        console.log("My response:");
                        console.log(response.json());
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

    static getRequestTypes(authorization_credentials) {
        return fetch(
            //`http://` + `${ip}` + `:3004/requestTypes`,
            `https://parking-django.herokuapp.com/request-types/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':'Bearer ' + authorization_credentials
                }
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

    static addRequest(authorization_credentials, newRequest) {
        // let newRequest = {
        //     "type": "test",
        //     "requestedAt": "test",
        //     "period": "test",
        //     "requestedFor": "test",
        //     "createdBy": "test",
        //     "requestedFrom": "test",
        //     "reservationRequestedAt": "test",
        //     "rentalRequestedAt": "test",
        //     "parkingNo": 3,
        //     "parking": 1
        // };
        const formData = `type=${newRequest.type}&requestedAt=${newRequest.requestedAt}&period=${newRequest.period}&requestedFor=${newRequest.requestedFor}&createdBy=${newRequest.createdBy}&requestedFrom=${newRequest.requestedFrom}&reservationRequestedAt=${newRequest.reservationRequestedAt}&rentalRequestedAt=${newRequest.rentalRequestedAt}&parkingNo=${newRequest.parkingNo}&parking=${newRequest.parking}`;

        return fetch(
            `https://parking-django.herokuapp.com/requests/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':'Bearer ' + authorization_credentials
                },
                body: formData

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

    static updateRequest(authorization_credentials, editedRequest) {
        // newRequest = {
        //      "type": "test",
        //      "requestedAt": "test",
        //      "period": "test",
        //      "requestedFor": "test",
        //      "createdBy": "test",
        //      "requestedFrom": "test",
        //      "reservationRequestedAt": "test",
        //      "rentalRequestedAt": "test",
        //      "parkingNo": 3,
        //      "parking": 1
        //  };
        const formData = `type=${editedRequest.type}&requestedAt=${editedRequest.requestedAt}&period=${editedRequest.period}&requestedFor=${editedRequest.requestedFor}&createdBy=${editedRequest.createdBy}&requestedFrom=${editedRequest.requestedFrom}&reservationRequestedAt=${editedRequest.reservationRequestedAt}&rentalRequestedAt=${editedRequest.rentalRequestedAt}&parkingNo=${editedRequest.parkingNo}&parking=${editedRequest.parking}`;
        log(formData);

        return fetch(
            `https://parking-django.herokuapp.com/requests/${editedRequest.id}/`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':'Bearer ' + authorization_credentials
                },
                body: formData

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

    static deleteRequest(authorization_credentials, id) {
        log("Id for the request to delete: " + id);

        return fetch(
            `https://parking-django.herokuapp.com/requests/${id}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':'Bearer ' + authorization_credentials
                }
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
}
