import {ip} from "./api";

export default class LoginAPI {
    static doLogin(username, password) {
        return fetch(
            // `http://` + `${ip}` + `:3004/users`,
            `https://parking-django.herokuapp.com/oauth2/token/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body:`grant_type=password&username=${username}&password=${password}&client_id=jZeRQs68ZvlXAe4x5VCYVw0exvq3Pclu21wztAnY&client_secret=KR6zeaGvjEZwbPndcUNRZS5XmTGWpie2XCyBbfG4nljYiCk5VPXh6phbYFX6zhke6Rq33QPngby4SgyBgX943zsNQAmDZHzhZ1YAR2r2KKSuhcDniow8vpVr4pSOXzx8`,

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