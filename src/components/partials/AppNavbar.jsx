import React from 'react';

import { Link, browserHistory } from 'react-router';

export default class AppNavbar extends React.Component {

    constructor() {
        super();

        this._logout = this._logout.bind(this);
    }

    /**
     *  Remove the JWT from the localStorage and redirect the user to the root
     */
    _logout() {
        localStorage.removeItem('token');
        browserHistory.push('/');
    }

    render() {
        return (
            <div>
                <div>
                    <Link to="/">Home</Link>
                </div>
                <div>
                    <Link to="/bar">Bar</Link>
                </div>
                <div>
                    <Link to="/log">Log</Link>
                </div>
                <div>
                    <a onClick={this._logout}>Logout</a>
                </div>
            </div>
        );
    }

}