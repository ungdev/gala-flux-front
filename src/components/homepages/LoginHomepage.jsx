import React from 'react';

import AuthService from 'services/AuthService';
import AuthStore from 'stores/AuthStore';
import AuthActions from 'actions/AuthActions';

import NotificationActions from 'actions/NotificationActions';

import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

require('styles/homepages/LoginHomepage.scss');

export default class LoginHomepage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            etuuttLoading: AuthStore.etuuttLoading,
        };

        // binding
        this._updateData = this._updateData.bind(this);
    }

    componentDidMount() {
        AuthStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this._updateData);
    }

    _updateData() {
        this.setState({etuuttLoading: AuthStore.etuuttLoading})
    }

    /**
     *  Redirect the user to the EtuUtt auth page
     */
    _login() {
        AuthActions.authEtuuttStarted();
        AuthService.authWithEtuUTT()
        .then((data) => {
            window.location = data.redirectUri;
        })
        .catch((error) => {
            AuthActions.authEtuuttDone();
            NotificationActions.error('Une erreur s\'est produite pendant l\'initialisation de la connexion via EtuUTT', error)
        });
    }

    render() {

        return (
            <div className="LoginPage">
                <h2>Flux</h2>
                <RaisedButton
                    icon={(this.state.etuuttLoading ? <CircularProgress size={20} thickness={2} style={{lineHeight: 'normal'}} /> : null)}
                    disabled={this.state.etuuttLoading}
                    label="Se connecter avec un compte UTT"
                    primary={true}
                    onTouchTap={this._login} />
            </div>
        );
    }

}
