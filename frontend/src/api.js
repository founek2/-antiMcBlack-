import encodeToken from './utils/encodeToken';

const intranetApiUrl = '/intranet/api';
export default class Api {
    constructor(errorHandler) {
        this.errorHandler = errorHandler;
    }

    logIn = (userName, password) => {
        return fetch(intranetApiUrl, {
            method: "POST", body: JSON.stringify({ "command": "user:login", "login": encodeToken(userName, password) }), headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(status)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(e))
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
            .then(status)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(e))


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
            .then(status)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(e))
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
            .then(status)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(e))
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
            .then(status)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(e))
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
            .then(status)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(e))
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
            .then(status)
            .then((response) => response.json())
            .then((json) => json.response)
            .catch((e) => this.errorHandler(e))
        //  return await response.ok ? result.json() : toogleError()
    }
}

function status(res) {
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res;
}