import React from 'react';
import Sound from 'react-sound';

import AuthStore from '../../stores/AuthStore';

require('../../styles/FlashScreen.scss');

const DESKTOP_NOTIFICATION_MAX_DURATION = 8000;

export default class FluxNotification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            config: AuthStore.notifications,
            message: props.message
        };

        // binding
        this._setConfig = this._setConfig.bind(this);
        this._showDesktopNotification = this._showDesktopNotification.bind(this);
        this._createDesktopNotification = this._createDesktopNotification.bind(this);
    }

    componentDidMount() {
        // Listen store changes
        AuthStore.addChangeListener(this._setConfig);

        this._showDesktopNotification();
    }

    componentWillUnmount() {
        // remove the store listener
        AuthStore.removeChangeListener(this._setConfig);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            message: nextProps.message
        });
    }

    /**
     * If the browser handle desktop notifications and
     * If the user wants to receive desktop notifications
     * create a new desktop notification
     */
    _showDesktopNotification() {
        if (this.state.config.desktop) {
            // check if the browser handle desktop notifications
            if (!("Notification" in window)) {
                console.log("Ce navigateur ne supporte pas les notifications desktop");
            }
            // check if the user is ok to receive notifications
            else if (Notification.permission === "granted") {
                this._createDesktopNotification();
            }
            // ask the user if he wants to receive desktop notifications
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {

                    // store the user choice
                    if(!('permission' in Notification)) {
                        Notification.permission = permission;
                    }

                    // check if the user is ok, create the notification
                    if (permission === "granted") {
                        this._createDesktopNotification();
                    }
                });
            }
        }
    }

    /**
     * Create a FLux desktop notification
     */
    _createDesktopNotification() {
        const title = this.state.message ? this.state.message : "Nouvelle activité";
        const notification = new Notification(title);

        // on click on the notification, focus on the Flux browser's tab and close the notification
        notification.onclick = _ => {
            window.focus();
            notification.close();
        };

        setTimeout(notification.close.bind(notification), DESKTOP_NOTIFICATION_MAX_DURATION);
    }

    /**
     * Set the notification configuration in the component state
     */
    _setConfig() {
        this.setState({ config: AuthStore.notifications });
    }

    render() {
        const styles = {
            flash: {
                display: this.state.config.flash ? "block" : "none"
            }
        };

        return (
            <div>
                <div className="flash_screen" style={styles.flash}></div>
                {
                    this.state.config.sound &&
                    <Sound
                        url="/src/assets/sounds/notification.wav"
                        playStatus={Sound.status.PLAYING}
                    />
                }
            </div>
        );
    }

}