import Swal from "sweetalert2";
import { userService } from '../../helpers/authservice/user.service';

export const state = {
    todos: [],
};

export const getters = {
    todos: state => state.todos,
};

export const mutations = {
    setTodos(state, newValue) {
        state.todos = newValue
    },
};

export const actions = {

    fetchOperationCreated({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `operations/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchOperationUpdated({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `operations/`+ payload.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchOperationList({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `operations/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                //body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchOperationListToday({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `operations/today/`+ payload.userId, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            }).catch(e => {
                reject(e);
            })
        })
    },
    fetchTransactionList({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `transactions/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                //body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchTransactionListbyId({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `transactions/`+ payload.userId, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                //body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchTransactionCreated({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `transactions/`, {
                headers:{
                    'apikey': process.env.VUE_APP_APIKEY,
                    'token': payload.token,
                },
                method: 'POST',
                body: payload.data
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchTransactionLiqudation({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `transactions/liquidation`, {
                method: 'POST',
                headers:{
                    'apikey': process.env.VUE_APP_APIKEY,
                    'token': payload.token,
                },
                //body: payload.data
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchTransactionLoad({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `transactions/load`, {
                method: 'POST',
                headers:{
                    'apikey': process.env.VUE_APP_APIKEY,
                    'token': payload.token,
                },
                //body: payload.data
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchTransactionLoadByUser({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `transactions/byuser/` + payload.id, {
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                method: 'POST',
                body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchTransactionUpdate({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `transactions/`+ payload.id, {
                method: 'PUT',
                headers:{
                    'apikey': process.env.VUE_APP_APIKEY,
                    'token': payload.token,
                },
                body: payload.data
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchTransactionusdtUpdate({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `transactions/usdt/`+ payload.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchUserCreated({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `users/`, {
                method: 'POST',
                body: payload.data
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchUserId({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `users/`+ payload.userId, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchUserList({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `users/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                //body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchNotificationList({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `users/notifications`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                //body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchUserUpdate({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `users/` + payload.userId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchUserDeleted({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `users/` + payload.userId, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
    fetchBalanceList({commit}, payload){
        return new Promise((resolve, reject) => {
            fetch( process.env.VUE_APP_API + `balances/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                'apikey': process.env.VUE_APP_APIKEY,
                'token': payload.token,
                },
                //body: JSON.stringify(payload.data)
            })
            .then(handleResponse)
            .then(res => {
                resolve(res);
            });
        })
    },
};

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if(response.status === 422){
                if(data.message === 'jwt expired'){
                    Swal.fire("Error!", 'Opss.. Su sesión a finalizado', "info");
                    userService.logout();
                    location.reload(true);
                }else{
                    Swal.fire("Error!", 'Opss.. error del sistema', "error");
                }
            }else if (response.status === 401) {
                userService.logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
