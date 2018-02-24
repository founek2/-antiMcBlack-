import encodeToken from './utils/encodeToken';
import { curry } from 'ramda';

const intranetApiUrl = '/intranet/api';
export default class Api {
    constructor(errorHandler, logOut) {
        this.checkResponse =  curriedCheckResponse(handeError);
        this.handleError = curriedHandleError(errorHandler)
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
            .catch(this.handleError)
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
            .then(this.checkResponse)
            .catch(this.handleError)

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
            .then(this.checkResponse)
            .catch(this.handleError)
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
            .catch(this.handleError)
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
            .then(this.checkResponse)
            .catch(this.handleError)
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
            .then(this.checkResponse)
            .catch(this.handleError)
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
            .catch(this.handleError)
    }
}

const checkStatus = (res) => {
   
    if (res.status === 204) {
        console.log('status', res.status)
        throw new Error('Černoch zablokoval náš server :\'(');
    }else if (!res.ok) {
        throw new Error('Bez připojení k internetu');
    }
    return res;
}

const checkResponse = (logOut, errorHandler, json) => {
    if (json.status === 'critical') {
        logOut();
        errorHandler(new Error('Platnost tokenu vypršela'));
    }
    return json.response;
}
const handeError = (errorHandler, e) => {
   return errorHandler(e) && {error: true}
}
const curriedCheckResponse = curry(checkResponse);
const curriedHandleError = curry(handeError);