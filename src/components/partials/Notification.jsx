import React from 'react';

import AuthStore from '../../stores/AuthStore';

require('../../styles/FlashScreen.scss');

export default class Notification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            config: AuthStore.notifications
        };

        // binding
        this._setConfig = this._setConfig.bind(this);
    }

    componentDidMount() {
        // Listen store changes
        AuthStore.addChangeListener(this._setConfig);
    }

    componentWillUnmount() {
        // remove the store listener
        AuthStore.removeChangeListener(this._setConfig);
    }

    /**
     * Set the notification configuration in the component state
     */
    _setConfig() {
        this.setState({ config: AuthStore.notifications });
    }

    render() {
        console.log(this.state.config);
        const styles = {
            flash: {
                display: this.state.config.flash ? "block" : "none"
            }
        };

        return (
            <div className="flash_screen" style={styles.flash}></div>
        );
    }

}