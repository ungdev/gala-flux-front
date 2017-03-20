import React from 'react';

import { browserHistory } from 'react-router';

export default class HomePage extends React.Component {

    constructor() {
        super();

        this._login = this._login.bind(this);
    }

    /**
     *  Write the token on the localStorage
     *  And redirect to the bar or according to the user team
     */
    _login() {
        localStorage.setItem('token', 'azeazeaz');
        browserHistory.push('/bar');
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