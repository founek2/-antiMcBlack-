import {
      red900,
      purple600,
      pink500,
      pink400,
      pink300,
      pink100,
      purple500,
      purple300,
      purple100,
      green400,
      orange400,
      yellow400,
      lightBlue400
} from "material-ui/styles/colors";

export const styles = {
      errorStyle: {
            color: red900
      },
      textColor: {
            color: pink500
      },
      floatingLabelFocusStyle: {
            //      color: purple600,
      },
      underlineStyle: {
            borderColor: pink500
      },
      underlineFocusStyle: {
            //       borderColor: purple600,
      },
      loginButton: {
            width: "140px"
      },
      loginButtonLabel: {
            padding: "0px 0px 0px 0px"
      },
      absenceCard: {
            padding: "20px"
      },
      absenceKinds: [
            { backgroundColor: "inherit" }, // normánlí hodina
            { backgroundColor: pink400 }, // nová absence
            { backgroundColor: green400 }, // omluvená absence
            { backgroundColor: orange400 }, //dřívější odchod
            { backgroundColor: yellow400 }, // pozdní příchod
            { backgroundColor: lightBlue400 } // školní akce
      ],
      drawerContainer: {
            position: "absolute",
		marginTop: "64px",
		overflow: 'hidden',
		height: 'calc(100% - 64px)',
      },
      appBarTitle: {},
      appBar: {
            backgroundColor: pink500
      },
      tableRowColumme: {
            textAlign: "center"
      },
      menuItemFocused: {
            backgroundColor: "rgba(0, 0, 0, 0.2)"
      },
      radioButton: {
            width: "12%",
            float: "left",
            marginRight: "4%"
      },
      trackSwitched: {
            backgroundColor: pink100
      },
      thumbSwitched: {
            backgroundColor: pink300
      },
      track: {
            backgroundColor: purple100
      },
      thumb: {
            backgroundColor: purple300
      },
      periodSwitch: {
            width: "60px",
            float: "left",
            paddingRight: "13px",
            display: "block"
      },
      absenceTop: {
            display: "flex",
            justifyContent: "space-between",
            height: "3em"
	},
	classificationTop: {
		display: 'flex',
		height: '3em',
	},
      passwordDialog: {
            textAlign: "center"
      },
      timeTableIframe: {
            width: "100%",
		height: "calc(100% - 68px)",
		border: 0,
      },
      gradesColumnHeader: {
            paddingLeft: "40%"
      },
      averageColumnHeader: {
            paddingRight: "8px",
            width: "8em"
      },
      absenceColumnHeader: {
            paddingRight: "0px",
            width: "6em"
      },
      mobile: {
            averageColumnHeader: {
                  paddingLeft: "80px"
            }
      },
      absenceTableHeaderRow: {
            width: "99%"
      },
      absenceRadioButtonGroup: {
            width: "370px"
      },
      absenceRadioButtonIcon: {
            width: "10px",
            height: "10px"
      },
      absencePeriodSwitchContainer: {
            width: "100px",
            paddingLeft: "10px",
            paddingTop: "0.8em",
            title: {
                  width: "80px",
                  display: "block",
                  textAlign: "center"
            }
      }
};
