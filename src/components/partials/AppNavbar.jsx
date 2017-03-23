import React from 'react';

import { browserHistory } from 'react-router';

// material ui
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Text from 'material-ui/Text';
import Button from 'material-ui/Button';

import AuthMenu from './AuthMenu.jsx';

export default class AppNavbar extends React.Component {

    /**
     * redirect
     * @param {String} path
     */
    static _redirectTo(path) {
        browserHistory.push(path);
    }

    render() {
        const style = {
            title: {
                flex: 1
            }
        };

        return (
            <AppBar>
                <Toolbar>
                    <Text colorInherit type="title" style={style.title} onClick={_ => AppNavbar._redirectTo('/')}>
                        Flux 2.0
                    </Text>
                    <Button contrast onClick={_ => AppNavbar._redirectTo('/bar')}>Bar</Button>
                    <Button contrast onClick={_ => AppNavbar._redirectTo('/log')}>Log</Button>
                    <AuthMenu />
                </Toolbar>
            </AppBar>
        );
    }

}