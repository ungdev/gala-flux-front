import React from 'react';

import AuthService from '../../services/AuthService';

import NotificationActions from '../../actions/NotificationActions';

import RaisedButton from 'material-ui/RaisedButton';

require('../../styles/homepages/LoginHomepage.scss');

export default class LoginHomepage extends React.Component {

    /**
     *  Redirect the user to the EtuUtt auth page
     */
    _login() {
        NotificationActions.loading('Connexion depuis EtuUTT en cours..');
        AuthService.authWithEtuUTT()
            .then((data) => {
                window.location = data.redirectUri;
            })
            .catch((error) => {
                NotificationActions.error('Une erreur s\'est produite pendant l\'initialisation de la connexion via EtuUTT', error)
            });
    }

    render() {

        return (
            <div className="LoginPage">
                <h2>Flux</h2>
                <RaisedButton label="Se connecter avec un compte UTT" primary={true} onTouchTap={this._login} />
            </div>
        );
    }

}
