import React from 'react';

import * as constants from '../../config/constants';
import AuthStore from '../../stores/AuthStore';
import AuthActions from '../../actions/AuthActions';
import NotificationActions from '../../actions/NotificationActions';
import AuthService from '../../services/AuthService';

import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover from 'material-ui/Popover';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

import LoginAs from './LoginAs.jsx';
import { Menu, MenuItem } from 'material-ui/Menu';

require('../../styles/partials/AuthMenu.scss');

class AuthMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            team: null,
            menuAnchor: null,
            openMenu: false,
            openLoginAs: false,
            loginAs: false,
            canLoginAs: false,
        };

        this._palette = props.muiTheme.palette;

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
            team: AuthStore.team,
            user: AuthStore.user,
            loginAs: AuthStore.loginAs,
            canLoginAs: AuthStore.can('auth/as'),
        });
    }

    /**
     * Close the menu and call the AuthActions to logout the user.
     */
    _logout() {
        this._closeMenu();
        AuthService.logout()
            .then(AuthActions.logout())
            .catch((error) => {
                NotificationActions.error("Une erreur s'est produite lors de la deconnexion", error);
            });
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
        return false;
    }

    /**
     * Close the menu and call the AuthService's method to come back to the main account
     */
    _backToMainAccount() {
        this._closeMenu();
        AuthActions.loginBack()
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant que votre tentative de reconnexion sur votre compte d\'origine', error);
        })
    }

    /**
     * Set the value of 'open' to false in the state
     * to close the AuthMenu
     */
    _closeMenu() {
        this.setState({ openMenu: false });
    }

    render() {

        // Disable if not authenticated
        if(!this.state.user || !this.state.team) {
            return null;
        }

        let avatarUri = constants.avatarBasePath + this.state.user.id;

        return (
            <div className="AuthMenu">
                <button onTouchTap={this._openMenu} className="AuthMenu__button">
                    <div className="AuthMenu__button__details">
                        <strong>{this.state.team.name}</strong><br/>
                        {this.state.user.name}
                    </div>
                    <Avatar src={avatarUri} backgroundColor="white" className="AuthMenu__button__avatar" />
                </button>
                <Popover
                    anchorEl={this.state.menuAnchor}
                    open={this.state.openMenu}
                    onRequestClose={this._closeMenu}
                    targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    <div className="AuthMenu__menuDetails">
                        <strong>{this.state.team.name}</strong><br/>
                        {this.state.user.name}
                        <Divider/>
                    </div>
                    <Menu>
                        <MenuItem onTouchTap={this._logout}>Se déconnecter</MenuItem>

                        { this.state.canLoginAs ?
                            <MenuItem onTouchTap={this._openLoginAs}>Se connecter en tant que ...</MenuItem>
                        :''}

                        { this.state.loginAs ?
                            <MenuItem onTouchTap={this._backToMainAccount}>Retour à votre compte</MenuItem>
                        :''}

                    </Menu>
                </Popover>

                { this.state.openLoginAs ?
                    <LoginAs open={this.state.openLoginAs} closeDialog={this._closeDialog} />
                :''}
            </div>
        );
    }

}
export default muiThemeable()(AuthMenu);
