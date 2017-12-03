import { blueGrey, cyan } from 'material-ui/colors';

const themeConfiguration = {
    palette: {
        'type': 'light',
        'primary': {
            '50': blueGrey[50],
            '100': blueGrey[100],
            '200': blueGrey[200],
            '300': blueGrey[300],
            '400': blueGrey[400],
            '500': blueGrey[800], // Primary color (used in appbar)
            '600': blueGrey[600],
            '700': blueGrey[600], // Hovered primary color
            '800': blueGrey[800],
            '900': blueGrey[900],
            'A100': blueGrey['A100'],
            'A200': blueGrey['A200'],
            'A400': blueGrey['A400'],
            'A700': blueGrey['A700'],
            'contrastDefaultColor': 'light'
        },
        'secondary': {
            '50': cyan[50],
            '100': cyan[100],
            '200': cyan[200],
            '300': cyan[300],
            '400': cyan[400],
            '500': cyan[500],
            '600': cyan[600],
            '700': cyan[700],
            '800': cyan[800],
            '900': cyan[900],
            'A100': cyan['A100'],
            'A200': cyan['A700'], // Accent color
            'A400': cyan['A400'], // Hovered accent color
            'A700': cyan['A700'],
            'contrastDefaultColor': 'light'
        },
    },
    zIndex: {
        appBar: 1100,
        dialog: 1500,
        dialogOverlay: 1400,
        drawerOverlay: 1200,
        layer: 2000,
        menu: 1000,
        mobileStepper: 900,
        navDrawer: 1300,
        popover: 2100,
        snackbar: 2900,
        tooltip: 3000,
    },


    // Custom variables
    'custom': {
        'appBarHeightXs': '48px',
        'appBarHeightMd': '64px',
        'tabsHeight': '48px',
    }

    // TODO fix it because it probably doen't work anymore on mui-1.0
    // spacing: spacing,
    // fontFamily: 'Roboto, sans-serif',
    // palette: {
    //     primary1Color: c.blueGrey800,
    //     primary2Color: c.blueGrey600,
    //     primary3Color: c.blueGrey400,
    //     accent1Color: c.cyanA700,
    //     accent2Color: c.grey100,
    //     accent3Color: c.cyan400,
    //     textColor: c.darkBlack,
    //     alternateTextColor: c.white,
    //     canvasColor: c.white,
    //     borderColor: c.grey300,
    //     disabledColor: fade(c.darkBlack, 0.3),
    //     pickerHeaderColor: c.blueGrey800,
    //     clockCircleColor: fade(c.darkBlack, 0.07),
    //     shadowColor: c.fullBlack,
    // },
};

export default themeConfiguration;
