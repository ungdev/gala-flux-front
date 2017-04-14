import React, {Component} from 'react';

import AppBar from 'material-ui/AppBar';
import AuthMenu from './AuthMenu.jsx';
import MainDrawer from './MainDrawer.jsx';
require('../../styles/partials/AppNavbar.scss');

export default class AppNavbar extends React.Component {

    render() {
        return (
            <AppBar
                title="Flux"
                className="AppNavbar"
                onTitleTouchTap={_ => router.navigate('home')}
                iconElementLeft={<MainDrawer />}
                iconElementRight={<AuthMenu />}
            />
        );
    }
}
