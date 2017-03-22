import React from 'react';

import { browserHistory } from 'react-router';
import AuthService from '../../services/AuthService';

export default class HomePage extends React.Component {

    constructor() {
        super();

        this._login = this._login.bind(this);
    }

    componentWillMount() {
        // when the home page his mounted, check if there is an authorization_code in the URL
        let authorizationCode = HomePage._getAuthorizationCode();
        if (authorizationCode) {
            AuthService.sendAuthorizationCode(authorizationCode,
                success => {
                    // on success, save the JWT
                    AuthService.saveJWT(success.body.jwt);
                    browserHistory.push('/bar');
                },
                error => {
                    console.log("send code error : ", error);
                }
            );
        }
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

    /**
     * Cut the current URL and search for the authorization code in it
     * @returns {String|null} The authorization code or null
     */
    static _getAuthorizationCode() {
        // get the part of the URL after '?'
        const query = (window.location.href).split("?")[1];
        if (query) {
            // look at each parameters
            const parameters = query.split("&");
            for (let i = 0; i < parameters.length; i++) {
                // if the parameter name is authorization_code, return the value
                const parameter = parameters[i].split("=");
                if (parameter[0] == "authorization_code")
                    return parameter[1];
            }
        }
        return null;
    }

}