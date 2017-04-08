import React from 'react';

import muiThemeable from 'material-ui/styles/muiThemeable';
import RaisedButton from 'material-ui/RaisedButton';
import AuthService from '../../services/AuthService';
import NotificationActions from '../../actions/NotificationActions';
require('../../styles/pages/HomePage.scss');

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this._palette = props.muiTheme.palette;

        this._login = this._login.bind(this);
    }

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
            <div className="container">
                <h2 className="title">Flux</h2>
                <RaisedButton label="Se connecter avec un compte UTT" primary={true} onTouchTap={this._login} />
            </div>
        );
    }

}
export default muiThemeable()(HomePage);
