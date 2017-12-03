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
export default class Boot extends React.Component {

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

    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.state.ready ?
                    this.props.children
                :
                    <div className="BootLayout">
                        <img src={LOGO} alt="Flux" />
                        <CircularProgress/>
                    </div>
                }
                <ErrorNotification />
            </div>
        );
    }
}
