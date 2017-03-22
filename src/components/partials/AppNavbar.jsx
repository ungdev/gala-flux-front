import React from 'react';

import { browserHistory } from 'react-router';

// material ui
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Text from 'material-ui/Text';
import Button from 'material-ui/Button';

export default class AppNavbar extends React.Component {

    constructor() {
        super();

        this._logout =  this._logout.bind(this);
        this._redirectTo=  this._redirectTo.bind(this);
    }

    /**
     *  Remove the JWT from the localStorage and redirect the user to the root
     */
    _logout() {
        localStorage.removeItem('token');
        this._redirectTo('/');
    }

    /**
     *  The redirection path
     *  @param path
     */
    _redirectTo(path) {
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
                    <Text colorInherit type="title" style={style.title} onClick={_ => this._redirectTo('/')}>
                        Flux 2.0
                    </Text>
                    <Button contrast onClick={_ => this._redirectTo('/bar')}>Bar</Button>
                    <Button contrast onClick={_ => this._redirectTo('/log')}>Log</Button>
                    <Button contrast onClick={_ => this._logout()}>Logout</Button>
                </Toolbar>
            </AppBar>
        );
    }

}