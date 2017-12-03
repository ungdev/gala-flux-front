import React from 'react';

import AuthService from 'services/AuthService';
import AuthStore from 'stores/AuthStore';
import AuthActions from 'actions/AuthActions';
import { withStyles } from 'material-ui/styles';

import NotificationActions from 'actions/NotificationActions';

import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';

import LOGO from 'assets/images/logos/logo.svg';
import GOOGLEPLAY_BADGE from 'assets/images/google-play-badge.png';

const styles = theme => ({
    root: {
        position: 'absolute',
        top: '112px',
        bottom: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logo: {
        marginTop: '10vh',
        marginBottom: '5vh',
        filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 1px 6px)',
    },
    googlePlayLink: {
        marginTop: '3vh',
    },
    googlePlayLogo: {
        height: '80px',
    },
});

class LoginScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            etuuttLoading: AuthStore.etuuttLoading,
            connected: AuthStore.connected,
        };

        // binding
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        AuthStore.addChangeListener(this.updateState);
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this.updateState);
    }

    updateState() {
        this.setState({
            etuuttLoading: AuthStore.etuuttLoading,
            connected: AuthStore.connected,
        });
    }

    /**
     *  Redirect the user to the EtuUtt auth page
     */
    login() {
        AuthActions.authEtuuttStarted();
        AuthService.getEtuUTTRedirectionURI()
        .then((data) => {
            window.location = data.redirectUri;
        })
        .catch((error) => {
            AuthActions.authEtuuttDone();
            NotificationActions.error('Une erreur s\'est produite pendant l\'initialisation de la connexion via EtuUTT', error)
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={'BootLayout ' + classes.root}>
                <img src={LOGO} alt="Flux" className={classes.logo} height="200"/>
                { this.state.connected === null && !this.state.etuuttLoading ?
                    <CircularProgress/>
                :
                    [
                        <Button raised
                            key={1}
                            icon={(this.state.etuuttLoading ? <CircularProgress size={20} thickness={2} style={{lineHeight: 'normal'}} /> : null)}
                            disabled={this.state.etuuttLoading}
                            color="primary"
                            onTouchTap={this.login}
                        >
                            Se connecter avec un compte UTT
                        </Button>,
                        (!global.Android &&
                            <a key={2} className={classes.googlePlayLink} href="http://play.google.com/store/apps/details?id=fr.utt.ung.flux">
                                <img className={classes.googlePlayLogo} src={GOOGLEPLAY_BADGE} alt="Disponible sur Google Play" />
                            </a>
                        )
                    ]
                }
            </div>
        );
    }

}
export default withStyles(styles)(LoginScene);
