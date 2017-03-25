import React from 'react';

import AuthService from '../../services/AuthService';

export default class HomePage extends React.Component {

    constructor() {
        super();

        this._login = this._login.bind(this);
    }

    componentWillMount() {
        // when the home page his mounted, check if there is an authorization_code in the URL
        // we check it here because the EtuUtt redirect the user on '/' (this page)
        let authorizationCode = HomePage._getAuthorizationCode();
        if (authorizationCode) {
            AuthService.sendAuthorizationCode(authorizationCode,
                error => {
                    console.log("send code error : ", error);
                }
            );
        }
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

    /**
     *  Redirect the user to the EtuUtt auth page
     */
    _login() {
        AuthService.authWithEtuUTT(resp => {
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