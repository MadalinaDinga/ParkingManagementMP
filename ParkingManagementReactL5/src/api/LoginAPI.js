
import {ip} from "./api";

export default class UsersAPI {
    static getUsers() {
        return fetch(
            `http://` + `${ip}` + `:3004/users`,
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
}