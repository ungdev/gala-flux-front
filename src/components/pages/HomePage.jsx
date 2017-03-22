import React from 'react';

import { browserHistory } from 'react-router';
import AuthService from '../../services/AuthService';

export default class HomePage extends React.Component {

    constructor() {
        super();

        this._login = this._login.bind(this);
    }

    componentWillMount() {
        console.log('check url params');
        let authorizationCode = this.getAuthorizationCode();
        if (authorizationCode) {
            AuthService.sendAuthorizationCode(authorizationCode, success => {
                console.log("logged ! : ", success);
                AuthService.saveJWT('jwtetu');
                browserHistory.push('/bar');
            }, error => {
                console.log("send code error : ", error);
            });
        }
    }

    /**
     * Cut the current URL and search for the authorization code
     * @returns {String|null} The authorization code or null
     */
    getAuthorizationCode() {
        let query = (window.location.href).split("?")[1];
        if (query) {
            let parameters = query.split("&");
            for (let i = 0; i < parameters.length; i++) {
                let parameter = parameters[i].split("=");
                if (parameter[0] == "authorization_code")
                    return parameter[1];
            }
        }
        return null;
    }

    /**
     *  Write the token on the localStorage
     *  And redirect to the bar or according to the user team
     */
    _login() {
        AuthService.authWithEtuUTT(resp => {
            console.log("resp : ", resp);
            window.location = resp.body.redirectUri;
        }, err => {
            console.log("err : ", err);
        });
    }

    render() {
        return (
            <div>
                <button onClick={this._login}>
                    Login
                </button>
            </div>
        );
    }

}