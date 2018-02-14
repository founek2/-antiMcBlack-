import { red900, purple600, pink500, pink300, pink100 } from 'material-ui/styles/colors';

export const styles = {
    errorStyle: {
        color: red900,
    },
    textColor: {
        color: pink500,
    },
    floatingLabelFocusStyle: {
        //      color: purple600,
    },
    underlineStyle: {
        borderColor: pink500,
    },
    underlineFocusStyle: {
        //       borderColor: purple600,
    },
    loginCard: {
        margin: 'auto',
        width: '35%',
        padding: "30px 10px 40px 10px",
        textAlign: 'center',
    },
    loginCardActions: {
        textAlign: 'center',
    },
    absenceCard: {
        padding: '20px'
    },
    drawerContainer: {
        position: 'absolute',
        marginTop: '64px'
    },
    appBarTitle: {

    },
    appBar: {
        backgroundColor: pink500,
    },
    tableRowColumme: {
        textAlign: 'center'
    },
    tableRowColummeKind1: { //nová absence
        backgroundColor: pink500,
    },
    tableRowColummeKind2: { //omluvená absence
        backgroundColor: purple600,
    },
    menuItemFocused: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    radioButton: {
        width: '12%',
        float: 'left',
        marginRight: '4%',

    },
    trackSwitched: {
        backgroundColor: pink100,
    },
    thumbSwitched: {
        backgroundColor: pink300,
    },
    periodSwitch: {
        width: '120px',
        float: 'left',
        paddingRight: '13px',
        display: 'block',
    },
    absenceTop: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    passwordDialog: {
        textAlign: 'center',
    },
    timeTableIframe: {
        width: '100%',
        height: '100%'
    },
    gradesColumnHeader: {
        paddingLeft: '40%',
    },
    averageColumnHeader: {
        paddingRight: '8px',
    },
    absenceColumnHeader: {
        paddingRight: '0px'
    },
    mobile: {
        averageColumnHeader: {
            paddingLeft: '80px',
        }
    },
    absenceTableHeaderRow:{
        width: '99%'
    },
    absenceRadioButtonGroup: {
        width: '370px',
    }
};