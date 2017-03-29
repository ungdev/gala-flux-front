import * as c from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

const themeConfiguration = {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: c.indigo500,
        primary2Color: c.indigo700,
        primary3Color: c.grey400,
        accent1Color: c.redA200,
        accent2Color: c.grey100,
        accent3Color: c.grey500,
        textColor: c.darkBlack,
        alternateTextColor: c.white,
        canvasColor: c.white,
        borderColor: c.grey300,
        disabledColor: fade(c.darkBlack, 0.3),
        pickerHeaderColor: c.indigo500,
        clockCircleColor: fade(c.darkBlack, 0.07),
        shadowColor: c.fullBlack,
    },
};

export default themeConfiguration;
