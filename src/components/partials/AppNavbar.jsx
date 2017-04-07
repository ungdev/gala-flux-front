import React, {Component} from 'react';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import AuthMenu from './AuthMenu.jsx';
import MainDrawer from './MainDrawer.jsx';
require('../../styles/partials/AppNavbar.scss');

const styles = {
    title: {
        cursor: 'pointer',
    },
};

export default class AppNavbar extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        return (
            <AppBar
                title="Flux"
                titleStyle={styles.title}
                onTitleTouchTap={_ => browserHistory.push('/')}
                iconElementLeft={<MainDrawer />}
                iconElementRight={<AuthMenu />}
            />
        );
    }
}
