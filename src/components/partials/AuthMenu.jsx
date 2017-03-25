import React from 'react';

import AuthStore from '../../stores/AuthStore';
import AuthActions from '../../actions/AuthActions';

import Button from 'material-ui/Button';
import LoginAs from './LoginAs.jsx';
import { Menu, MenuItem } from 'material-ui/Menu';

export default class AuthMenu extends React.Component {

    constructor() {
        super();

        this.state = {
            user: null,
            menuAnchor: null,
            openMenu: false,
            openLoginAs: false,
            loginAs: false
        };

        // binding
        this._openMenu = this._openMenu.bind(this);
        this._closeMenu = this._closeMenu.bind(this);
        this._logout = this._logout.bind(this);
        this._openLoginAs = this._openLoginAs.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._backToMainAccount = this._backToMainAccount.bind(this);
    }

    componentDidMount() {
        // listen the store change
        AuthStore.addChangeListener(this._onAuthStoreChange.bind(this));
    }

    /**
     * When there is a change in the AuthStore, update the value of user in the component state
     */
    _onAuthStoreChange() {
        this.setState({
            user: AuthStore.user,
            loginAs: AuthStore.loginAs
        });
    }

    /**
     * Close the menu and call the AuthActions to logout the user.
     */
    _logout() {
        this._closeMenu();
        AuthActions.logout();
    }

    /**
     * Set the value of 'openLoginAs' to true in the state
     * to open the "login as" dialog
     */
    _openLoginAs() {
        this.setState({ openLoginAs: true });
        this._closeMenu();
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
     * Close the menu and call the AuthService's method to come back to the main account
     */
    _backToMainAccount() {
        this._closeMenu();
        AuthActions.backToMainAccount();
    }

    /**
     * Set the value of 'open' to false in the state
     * to close the AuthMenu
     */
    _closeMenu() {
        this.setState({ openMenu: false });
    }

    render() {
        const style = {
            backToMainAccount: {
                // only show "back to main account" if the user is login as someone else
                display: this.state.loginAs ? "block" : "none"
            }
        };

        return (
            <div>
                <Button
                    contrast
                    aria-owns="auth-menu"
                    aria-haspopup="true"
                    onClick={this._openMenu}
                >
                    {this.state.user ? this.state.user.name : ''}
                </Button>
                <Menu
                    id="auth-menu"
                    anchorEl={this.state.menuAnchor}
                    open={this.state.openMenu}
                    onRequestClose={this._closeMenu}
                >
                    <MenuItem onClick={this._logout}>Logout</MenuItem>
                    <MenuItem onClick={this._openLoginAs}>Login as</MenuItem>
                    <MenuItem onClick={this._backToMainAccount} style={style.backToMainAccount}>Back to main account</MenuItem>
                </Menu>
                <LoginAs open={this.state.openLoginAs} closeDialog={this._closeDialog} />
            </div>
        );
    }

}