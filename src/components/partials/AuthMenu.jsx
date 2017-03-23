import React from 'react';

import { browserHistory } from 'react-router';

import Button from 'material-ui/Button';
import { Menu, MenuItem } from 'material-ui/Menu';

import AuthService from '../../services/AuthService';

export default class AuthMenu extends React.Component {

    constructor() {
        super();

        this.state = {
            anchorEl: undefined,
            open: false,
        };

        // binding
        this._openMenu = this._openMenu.bind(this);
        this._closeMenu = this._closeMenu.bind(this);
        this._logout = this._logout.bind(this);
    }

    /**
     * Remove the JWT from the localStorage and redirect the user to the root
     */
    _logout() {
        this._closeMenu();
        AuthService.logout();
        AuthMenu._redirectTo('/');
    }

    /**
     * The redirection path
     * @param path
     */
    static _redirectTo(path) {
        browserHistory.push(path);
    }

    /**
     * Open the auth menu
     * @param event
     */
    _openMenu(event) {
        this.setState({ open: true, anchorEl: event.currentTarget });
    }

    /**
     * When the user click outside the menu, close it
     */
    _closeMenu() {
        this.setState({ open: false });
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
                    anchorEl={this.state.anchorEl}
                    open={this.state.open}
                    onRequestClose={this._closeMenu}
                >
                    <MenuItem onClick={this._logout}>Logout</MenuItem>
                    <MenuItem onClick={this._closeMenu}>Login as</MenuItem>
                    <MenuItem onClick={this._closeMenu}>Back to main account</MenuItem>
                </Menu>
            </div>
        );
    }

}