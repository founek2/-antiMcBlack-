/**
 * if param dont exist, then return default values
 * @param {Object} absenceState
 * @param {Object} classificationState
 */
export default (absenceState, classificationState) => ({
      leftMenuOpen: false,
      activeComponent: "default",
      menuItemsStyles: {},
      openDialogPassword: false,
      rightsClassification: false,
      rightsAbsence: false,
      absenceState: absenceState
            ? absenceState
            : {
                    numberOfRecords: 10,
                    currentWeek: 0,
                    totalWeek: 0,
                    items: {
                          1: [],
                          2: []
                    },
                    period: 2,
                    fetchingData: false
              },
      classificationState: classificationState
            ? classificationState
            : {
                    period: 2,
                    fetchingData: false,
                    items: {
                        1: [],
                        2: []
                  },
              },
      inputs: {
            passwordNew: {
                  value: "",
                  valid: true,
                  errorMessage: "Password musí mít min. délku 5 znaků"
            },
            passwordNewAgain: {
                  value: "",
                  valid: true,
                  errorMessage: "Hesla se neshodují"
            },
            passwordOld: {
                  value: "",
                  valid: true,
                  errorMessage: "Password musí mít min. délku 5 znaků"
            },
            dialog: {
                  valid: true,
                  errorMessage: "Zadané heslo není správné"
            }
      }
});
