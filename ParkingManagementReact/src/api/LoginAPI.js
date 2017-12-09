
export default class UsersAPI {
    static getUsers() {
        return fetch(
            // `http://` + `192.168.4.2` + `:3004/users`,
            `http://` + `192.168.0.181` + `:3004/users`,
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

// import {apiUrl, headers} from "./api";
// import {getLogger} from "../log/utils";
//
// const log = getLogger('auth/service');
// const AUTH_STARTED = 'auth/started';
// const AUTH_SUCCEEDED = 'auth/succeeded';
// const AUTH_FAILED = 'auth/failed';
// const action = (type, payload) => ({type, payload});
//
// export const login = (user) => (dispatch, getState) => {
//     if (getState().inprogress) {
//         log(`login already in progress`);
//         return;
//     }
//     log(`starting login`);
//     dispatch(action(AUTH_STARTED));
//     let ok = false;
//     log(`starting fetch ${apiUrl}/users/login`);
//     return fetch(`${apiUrl}users/login`, {method: 'POST', headers, body: JSON.stringify(user)})
//         .then(res => {
//             ok = res.ok;
//             log(`login res ok = ${ok}`);
//             return res.json();
//         })
//         .then(json => {
//             log(`login json = ${json}`);
//             dispatch(action(ok? AUTH_SUCCEEDED: AUTH_FAILED, json));//apeleaza reducer-ul
//         })
//         .catch(err => {
//             log(`login err = ${err.message}`);
//             dispatch(action(AUTH_FAILED, {issue: [{error: err.message}]}));
//         });
// };
//
// export const authReducer = (state = {token: null, inprogress: false}, action) => {
//     // log(`${action.type} ${JSON.stringify(state)}`);
//     switch (action.type) {
//         case AUTH_STARTED:
//             return {token: null, inprogress: true}; //se pune in state
//         case AUTH_SUCCEEDED:
//             return {token: action.payload.token, inprogress: false};
//         case AUTH_FAILED:
//             return {issue: action.payload.issue, inprogress: false};
//         default:
//             return state;
//     }
// };
