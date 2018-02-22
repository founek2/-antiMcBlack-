import encodeToken from './utils/encodeToken';
import { curry } from 'ramda';

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
            .catch((e) => this.errorHandler(e) || {error: true})
        //  return await response.ok ? result.json() : toogleError()
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
            .catch((e) => this.errorHandler(e) || {error: true})


        //  return await response.ok ? result.json() : toogleError()

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
            .catch((e) => this.errorHandler(e) || {error: true})
        //  return await response.ok ? result.json() : toogleError()
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
            .catch((e) => this.errorHandler(e) || {error: true})
        //  return await response.ok ? result.json() : toogleError()
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
            .catch((e) => this.errorHandler(e) || {error: true})
        //  return await response.ok ? result.json() : toogleError()
        // const data = await response.json();
        // return await data.response;
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
            .catch((e) => this.errorHandler(e) || {error: true})
        //  return await response.ok ? result.json() : toogleError()
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
            .catch((e) => this.errorHandler(e) || {error: true})
        //  return await response.ok ? result.json() : toogleError()
    }
}

const checkStatus = (res) => {
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res;
}

const checkResponse = (logOut, errorHandler, json) => {
    if (json.status === 'critical') {
        logOut();
        errorHandler(new Error(json.response), 'Platnost tokenu vypršela');
    }
    return json.response;
}

const curriedCheckResponse = curry(checkResponse);