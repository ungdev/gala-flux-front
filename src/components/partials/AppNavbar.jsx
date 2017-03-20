import React from 'react';

import { Link } from 'react-router';

export default class AppNavbar extends React.Component {

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
            </div>
        );
    }

}