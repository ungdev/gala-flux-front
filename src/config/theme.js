import * as c from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

const themeConfiguration = {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: c.blueGrey800,
        primary2Color: c.blueGrey600,
        primary3Color: c.blueGrey400,
        accent1Color: c.cyanA700,
        accent2Color: c.grey100,
        accent3Color: c.cyan400,
        textColor: c.darkBlack,
        alternateTextColor: c.white,
        canvasColor: c.white,
        borderColor: c.grey300,
        disabledColor: fade(c.darkBlack, 0.3),
        pickerHeaderColor: c.blueGrey800,
        clockCircleColor: fade(c.darkBlack, 0.07),
        shadowColor: c.fullBlack,
    },
};

export default themeConfiguration;
