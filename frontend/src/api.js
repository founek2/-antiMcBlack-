import encodeToken from './utils/encodeToken';

export const logIn = (userName, password) => {
    return fetch("/intranet", {
        method: "POST", body: JSON.stringify({ "command": "user:login", "login": encodeToken(userName, password) }), headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then((response) => response.json())
        .then((json) => json.response)
        .catch((e) => console.log('došlo k chybě logIn'))
    //  return await response.ok ? result.json() : toogleError()
}

export const rightsAbsence = (cid) => {

    return fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command": "absence:rights" }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    })
        .then((response) => response.json())
        .then((json) => json.response)
        .catch((e) => console.log('došlo k chybě rightsAbsence'))


    //  return await response.ok ? result.json() : toogleError()

}

export const getAbsence = (cid, period, week) => {
    return fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command": "absence:student", "period": period, "week": week, "person": Number(cid.split(':')[0]) }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    })
        .then((response) => response.json())
        .then((json) => json.response)
        .catch((e) => console.log('došlo k chybě getAbsence'))
    //  return await response.ok ? result.json() : toogleError()
}

export const rightsClassification = (cid) => {
    return fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command": "classification:rights" }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    })
    .then((response) => response.json())
    .then((json) => json.response)
    .catch((e) => console.log('došlo k chybě getAbsence'))
    //  return await response.ok ? result.json() : toogleError()
}

export const getClassification = (cid, period, week) => {
    return fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command": "classification:show", "period": period, "person": Number(cid.split(':')[0]) }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    })
    .then((response) => response.json())
    .then((json) => json.response)
    .catch((e) => console.log('došlo k chybě getAbsence'))
    //  return await response.ok ? result.json() : toogleError()
    // const data = await response.json();
    // return await data.response;
}

export const changePassword = (cid, userName, password) => {
    return fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command": "user:password", "password": encodeToken(userName, password) }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    })
    .then((response) => response.json())
    .then((json) => json.response)
    .catch((e) => console.log('došlo k chybě getAbsence'))
    //  return await response.ok ? result.json() : toogleError()
}

export const logOut = (cid) => {
    return fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command":"user:logout" }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    })
    .then((response) => response.json())
    .then((json) => json.response)
    .catch((e) => console.log('došlo k chybě getAbsence'))
    //  return await response.ok ? result.json() : toogleError()
}