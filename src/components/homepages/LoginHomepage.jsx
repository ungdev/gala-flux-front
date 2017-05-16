import React from 'react';

import AuthService from 'services/AuthService';
import AuthStore from 'stores/AuthStore';
import AuthActions from 'actions/AuthActions';

import NotificationActions from 'actions/NotificationActions';

import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import LOGO from 'assets/images/logos/logo.svg';
import GOOGLEPLAY_BADGE from 'assets/images/google-play-badge.png';

require('styles/homepages/LoginHomepage.scss');

export default class LoginHomepage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            etuuttLoading: AuthStore.etuuttLoading,
            connected: AuthStore.connected,
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
        this.setState({
            etuuttLoading: AuthStore.etuuttLoading,
            connected: AuthStore.connected,
        })
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
                <img src={LOGO} alt="Flux" className="LoginPage__logo" height="200"/>
                { this.state.connected === null && !this.state.etuuttLoading ?
                    <CircularProgress className="LoginPage__spinner"/>
                :
                    [
                        <RaisedButton
                            key={1}
                            icon={(this.state.etuuttLoading ? <CircularProgress size={20} thickness={2} style={{lineHeight: 'normal'}} /> : null)}
                            disabled={this.state.etuuttLoading}
                            label="Se connecter avec un compte UTT"
                            primary={true}
                            onTouchTap={this._login} />,
                        (!global.Android &&
                            <a key={2} className="LoginPage__googleplay" href="http://play.google.com/store/apps/details?id=fr.utt.ung.flux">
                                <img src={GOOGLEPLAY_BADGE} alt="Disponible sur Google Play"/>
                            </a>
                        )
                    ]
                }
            </div>
        );
    }

}
