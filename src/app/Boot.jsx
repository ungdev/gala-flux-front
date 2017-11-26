import React, { createElement } from 'react';

import AuthStore from "stores/AuthStore";

import ErrorNotification from "app/Layout/components/ErrorNotification.jsx";
import { CircularProgress } from 'material-ui/Progress';
import LOGO from 'assets/images/logos/logo.svg';

import {} from 'app/App.scss';

/**
 * Root of all react components
  * @param {Object} router react-router router object
 */
export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ready: AuthStore.ready,
        };

        // binding
        this.handleAuthStoreChange = this.handleAuthStoreChange.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        AuthStore.addChangeListener(this.handleAuthStoreChange);

        // init
        this.handleAuthStoreChange();
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this.handleAuthStoreChange);
    }

    /**
     * Set the state with the new data of the store
     */
    handleAuthStoreChange() {
        if(this.state.ready != AuthStore.ready) {
            this.setState({ ready: AuthStore.ready })
        }
    }

    // {createElement(this.state.homepage, {route: this.state.route})}

    render() {
            return (
                <div>
                    {this.state.ready ?
                        this.props.children
                    :
                        <div className="Layout_LoginScene">
                            <img src={LOGO} alt="Flux" className="Layout_LoginScene__logo" height="200"/>
                            <CircularProgress className="Layout_LoginScene__spinner"/>
                        </div>
                    }
                    <ErrorNotification />
                </div>
            );
        }
}
