import React, {Component} from 'react';

import AppBar from 'material-ui/AppBar';
import AuthMenu from './AuthMenu.jsx';
import MainDrawer from './MainDrawer.jsx';
require('../../styles/partials/AppNavbar.scss');

export default class AppNavbar extends React.Component {

    render() {
        const styles = {
            title: {
                cursor: 'pointer',
            }
        };

        return (
            <AppBar
                title="Flux"
                titleStyle={styles.title}
                onTitleTouchTap={_ => router.navigate('home')}
                iconElementLeft={<MainDrawer />}
                iconElementRight={<AuthMenu />}
            />
        );
    }
}
