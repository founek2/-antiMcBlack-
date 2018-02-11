import encodeToken from './utils/encodeToken';

export const logIn = async (userName, password) => {
    console.log(userName, password, encodeToken(userName, password))
    const response = await fetch("/intranet",{method:"POST",body:JSON.stringify({"command":"user:login","login":encodeToken(userName, password)}),headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }});
  //  return await response.ok ? result.json() : toogleError()
    return await response.json();
}
