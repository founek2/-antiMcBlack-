import encodeToken from './utils/encodeToken';
import { curry } from 'ramda';

const customError = {message: {mess: 'Bez připojení k internetu', time: 3000}}
const intranetApiUrl = '/intranet/api';
export default class Api {
    constructor(errorHandler, logOut) {
        this.errorHandler = errorHandler;
        this.checkResponse = curriedCheckResponse(logOut, errorHandler);
    }

    logIn = (userName, password) => {
        return fetch(intranetApiUrl, {
            method: "POST", body: JSON.stringify({ "command": "user:login", "login": encodeToken(userName, password) }), headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(checkStatus)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(customError) || {error: true})
    }

    rightsAbsence = (cid) => {

        return fetch(intranetApiUrl, {
            method: "POST",
            body: JSON.stringify({ "command": "absence:rights" }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-cid': cid,
            }
        })
            .then(checkStatus)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(customError) || {error: true})

    }
    getAbsence = (cid, period, week) => {
        return fetch(intranetApiUrl, {
            method: "POST",
            body: JSON.stringify({ "command": "absence:student", "period": period, "week": week, "person": Number(cid.split(':')[0]) }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-cid': cid,
            }
        })
            .then(checkStatus)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(customError) || {error: true})
    }

    rightsClassification = (cid) => {
        return fetch(intranetApiUrl, {
            method: "POST",
            body: JSON.stringify({ "command": "classification:rights" }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-cid': cid,
            }
        })
            .then(checkStatus)
            .then((response) => response.json())
            .then(this.checkResponse)
            .catch((e) => this.errorHandler(customError) || {error: true})
    }

    getClassification = (cid, period, week) => {
        return fetch(intranetApiUrl, {
            method: "POST",
            body: JSON.stringify({ "command": "classification:show", "period": period, "person": Number(cid.split(':')[0]) }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-cid': cid,
            }
        })
            .then(checkStatus)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(customError) || {error: true})
    }

    changePassword = (cid, userName, password) => {
        return fetch(intranetApiUrl, {
            method: "POST",
            body: JSON.stringify({ "command": "user:password", "password": encodeToken(userName, password) }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-cid': cid,
            }
        })
            .then(checkStatus)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(customError) || {error: true})
    }

    logOut = (cid) => {
        return fetch(intranetApiUrl, {
            method: "POST",
            body: JSON.stringify({ "command": "user:logout" }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-cid': cid,
            }
        })
            .then(checkStatus)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(customError) || {error: true})
    }
}

const checkStatus = (res) => {
    if (res.status === 403) {
        throw new Error({mess: 'Černoch zablokoval náš backend :(', time: 99999999});
    }else if (!res.ok) {
        throw new Error({mess: 'Bez připojení k internetu', time: 3000});
    }
    return res;
}

const checkResponse = (logOut, errorHandler, json) => {
    if (json.status === 'critical') {
        logOut();
        errorHandler(new Error({mess: 'Platnost tokenu vypršela', time: 3000}), 'Platnost tokenu vypršela');
    }
    return json.response;
}

const curriedCheckResponse = curry(checkResponse);