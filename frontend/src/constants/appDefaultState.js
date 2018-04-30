/**
 * if cid exists, then it fill state with params
 * @param {Object} absenceState
 * @param {Object} classificationState
 */
export default (cid, userName, loginMessage) => {
      if (cid) {
            return {
                  logged: true,
                  cid: cid,
                  userName,
                  loginMessage,
                  errorState: {
                        fetchErrorMsg: "Bez připojení k internetu",
                        errorOpen: false,
                        autoHideDuration: 3000
                  }
            };
      } else {
            return {
                  logged: false,
                  errorState: {
                        fetchErrorMsg: "Bez připojení k internetu",
                        errorOpen: false,
                        autoHideDuration: 3000
                  },
                  logInProggres: false
            };
      }
};
