import encodeToken from './utils/encodeToken';

export const logIn = async (userName, password) => {
    console.log(userName, password, encodeToken(userName, password))
    const response = await fetch("/intranet", {
        method: "POST", body: JSON.stringify({ "command": "user:login", "login": encodeToken(userName, password) }), headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    });
    //  return await response.ok ? result.json() : toogleError()
    const data = await response.json();
    return await data.response;
}

export const rightsAbsence = async (cid) => {
    const response = await fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command":"absence:rights" }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    });
    //  return await response.ok ? result.json() : toogleError()
    const data = await response.json();
    return await data.response;
}

export const getAbsence = async (cid, period, week) => {
    const response = await fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command":"absence:student","period":period,"week":week,"person": Number(cid.split(':')[0]) }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    });
    //  return await response.ok ? result.json() : toogleError()
    const data = await response.json();
    return await data.response;
}

export const rightsClassification = async (cid) => {
    const response = await fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command":"classification:rights" }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    });
    //  return await response.ok ? result.json() : toogleError()
    const data = await response.json();
    return await data.response;
}

export const getClassification = async (cid, period, week) => {
    const response = await fetch("/intranet", {
        method: "POST",
        body: JSON.stringify({ "command":"classification:show","period":period,"person": Number(cid.split(':')[0]) }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-cid': cid,
        }
    });
    //  return await response.ok ? result.json() : toogleError()
    const data = await response.json();
    return await data.response;
}