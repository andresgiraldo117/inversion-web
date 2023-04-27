import { authHeader } from './auth-header';
import Swal from "sweetalert2";

export const userService = {
    login,
    logout,
    register,
    getAll,
};

function login(email, password) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'apikey': process.env.VUE_APP_APIKEY},
            body: JSON.stringify({ email, password })
        };

        return fetch(process.env.VUE_APP_API + `auth/login`, requestOptions)
            .then(handleResponse)
            .catch(error => {
                console.log(error)
                Swal.fire("Lo sentimos!", error, "error");

            })
            .then(user => {
                // login successful if there's a jwt token in the response
                if (user.response.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user.response));
                }
                return user.response;
            });


}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
    return fetch(`/users/register`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
