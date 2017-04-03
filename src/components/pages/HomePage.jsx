import React from 'react';

import muiThemeable from 'material-ui/styles/muiThemeable';
import RaisedButton from 'material-ui/RaisedButton';

import AuthService from '../../services/AuthService';
import NotificationActions from '../../actions/NotificationActions';

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
        AuthService.authWithEtuUTT(resp => {
            window.location = resp.body.redirectUri;
        }, err => {
            console.log("err : ", err);
        });
    }

    render() {

        const style = {
            container: {
                height: '100%',
                padding: 0,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '30px',
                textAlign: 'center',
            },
            title: {
                fontSize: '7em',
                fontWeight: 'normal',
                marginBottom: '20px',
            },
        };

        return (
            <div style={style.container}>
                <div>
                    <h2 style={style.title}>Flux</h2>
                    <RaisedButton label="Se connecter avec un compte UTT" primary={true} onTouchTap={this._login} />
                </div>
            </div>
        );
    }

}
export default muiThemeable()(HomePage);
