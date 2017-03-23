import React from 'react';

import { browserHistory } from 'react-router';

import Button from 'material-ui/Button';
import LoginAs from './LoginAs.jsx';
import { Menu, MenuItem } from 'material-ui/Menu';

import AuthService from '../../services/AuthService';

export default class AuthMenu extends React.Component {

    constructor() {
        super();

        this.state = {
            menuAnchor: undefined,
            openMenu: false,
            openLoginAs: false
        };

        // binding
        this._openMenu = this._openMenu.bind(this);
        this._closeMenu = this._closeMenu.bind(this);
        this._logout = this._logout.bind(this);
        this._openLoginAs = this._openLoginAs.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
    }

    /**
     * Call the AuthService to logout the user.
     * Then, redirect him to the home page
     */
    _logout() {
        this._closeMenu();
        AuthService.logout();
        AuthMenu._redirectTo('/');
    }

    /**
     * Set the value of 'openLoginAs' to true in the state
     * to open the "login as" dialog
     */
    _openLoginAs() {
        this.setState({ openLoginAs: true });
    }

    /**
     * Set the value of 'openLoginAs' to false in the state
     * to close the "login as" dialog
     */
    _closeDialog() {
        this.setState({ openLoginAs: false });
    }

    /**
     * Set the value of 'open' to true in the state
     * to open the AuthMenu at the same position as the AuthMenu button
     *
     * @param event : used to get the position of the AuthMenu button
     */
    _openMenu(event) {
        this.setState({ openMenu: true, menuAnchor: event.currentTarget });
    }

    /**
     * Set the value of 'open' to false in the state
     * to close the AuthMenu
     */
    _closeMenu() {
        this.setState({ openMenu: false });
    }

    /**
     * The redirection path
     * @param path
     */
    static _redirectTo(path) {
        browserHistory.push(path);
    }

    render() {
        return (
            <div>
                <Button
                    contrast
                    aria-owns="auth-menu"
                    aria-haspopup="true"
                    onClick={this._openMenu}
                >
                    [Username]
                </Button>
                <Menu
                    id="auth-menu"
                    anchorEl={this.state.menuAnchor}
                    open={this.state.openMenu}
                    onRequestClose={this._closeMenu}
                >
                    <MenuItem onClick={this._logout}>Logout</MenuItem>
                    <MenuItem onClick={this._openLoginAs}>Login as</MenuItem>
                    <MenuItem onClick={this._closeMenu}>Back to main account</MenuItem>
                </Menu>
                <LoginAs open={this.state.openLoginAs} closeDialog={this._closeDialog} />
            </div>
        );
    }

}