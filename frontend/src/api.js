import encodeToken from './utils/encodeToken';

export const logIn = async (userName, password) => {
    console.log(userName, password, encodeToken(userName, password))
    const response = await fetch("/intranet",{method:"POST",body:JSON.stringify({"command":"user:login","login":encodeToken(userName, password)}),headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }});
  //  return await response.ok ? result.json() : toogleError()
    const data = await response.json();
    return await data.response;
}
