import React from 'react';

import muiThemeable from 'material-ui/styles/muiThemeable';
require('../../styles/pages/HomePage.scss');

import LoginPage from './LoginPage.jsx';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this._palette = props.muiTheme.palette;
    }

    render() {

        return (
            <div className="container">
                <LoginPage />
            </div>
        );
    }

}
export default muiThemeable()(HomePage);
