import React from 'react';

import muiThemeable from 'material-ui/styles/muiThemeable';
require('../styles/pages/HomePage.scss');

import AuthStore from '../stores/AuthStore';

import LoginPage from './pages/LoginPage.jsx';
import BarPage from './pages/BarPage.jsx';
import LogPage from './pages/LogPage.jsx';

class Root extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            team: null
        };

        this._palette = props.muiTheme.palette;

        // binding
        this._setUser = this._setUser.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        AuthStore.addChangeListener(this._setUser);
        // init state
        this._setUser();
    }

    componentWillUnmount() {
        // remove the stores listeners
        AuthStore.removeChangeListener(this._setUser);
    }

    /**
     * Set the state with the new data of the store
     */
    _setUser() {
        this.setState({
            user: AuthStore.user,
            team: AuthStore.team
        });
    }

    render() {

        let page = <LoginPage />;

        // if the user is authenticated, look at his team to display the right page
        if (this.state.user && this.state.team) {
            if (this.state.team.group === "bar") {
                page = <BarPage />
            } else {
                page = <LogPage />
            }
        }

        return (
            <div>
                {page}
            </div>
        );
    }

}
export default muiThemeable()(Root);
