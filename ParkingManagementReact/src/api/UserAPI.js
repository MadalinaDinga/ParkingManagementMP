export default class UserAPI {

    static getUserData(authorization_credentials) {
        return fetch(
            `https://parking-django.herokuapp.com/parking/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':'Bearer ' + authorization_credentials
                },
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
