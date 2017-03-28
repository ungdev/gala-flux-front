import React, {Component} from 'react';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';

import AuthMenu from './AuthMenu.jsx';
import MainDrawer from './MainDrawer.jsx';


export default class AppNavbar extends React.Component {

    constructor(props, context) {
        super(props);

        this.styles = {
            title: {
                cursor: 'pointer',
            },
        };
    }
    render() {
        return (
            <AppBar
                title="Flux 2.0"
                titleStyle={this.styles.title}
                onTitleTouchTap={_ => browserHistory.push('/')}
                iconElementLeft={<MainDrawer />}
                iconElementRight={<AuthMenu />}
            />
        );
    }
}
