import React from 'react';
import Sound from 'react-sound';

import NotificationStore from 'stores/NotificationStore';
import NotificationActions from 'actions/NotificationActions';
import AuthStore from 'stores/AuthStore';
import { browserHistory } from 'react-router'

require('./FluxNotification.scss');

import NOTIFICATION_SOUND from 'assets/sounds/notification.wav';
import DESKTOP_NOTIFICATION_ICON from 'assets/images/logos/favicon-32x32.png';
const DESKTOP_NOTIFICATION_MAX_DURATION = 8000;

export default class FluxNotification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            configuration: NotificationStore.configuration,
            notifications: [],
            flashScreen: false,
            playing: Sound.status.STOPPED,
        };

        this._lastNotificationId = -1;

        // We will wate 5 seconds before start flash screen, this will contain the timeout
        this._flashScreenTimeout = null;

        // binding
        this._updateData = this._updateData.bind(this);
        this._clearNotifications = this._clearNotifications.bind(this);
        this._showDesktopNotification = this._showDesktopNotification.bind(this);
    }

    componentDidMount() {
        // Listen store changes
        NotificationStore.addChangeListener(this._updateData);
        document.body.addEventListener('click', this._clearNotifications, true);
        document.body.addEventListener('keydown', this._clearNotifications, true);

    }

    componentWillUnmount() {
        // remove the store listener
        NotificationStore.removeChangeListener(this._updateData);
    }

    /**
     * Set the notification data in the component state
     */
    _updateData() {
        let notifications = NotificationStore.notifications;
        this.setState({
            configuration: NotificationStore.configuration,
            notifications: notifications,
            flashScreen: (notifications.length == 0) ? false : this.state.flashScreen,
        });

        this._showDesktopNotification(notifications);

        // Start flash scren in 5 seconds
        if(notifications.length > 0 && !this._flashScreenTimeout && !this.state.flashScreen) {
            this._flashScreenTimeout = setTimeout(() => {
                this._flashScreenTimeout = null;
                if(this.state.notifications.length > 0) {
                    this.setState({flashScreen: true})
                }
            }, 5000);
        }
    }

    _clearNotifications() {
        NotificationActions.clearNotifications();
        if(this._flashScreenTimeout) {
            clearTimeout(this._flashScreenTimeout);
            this._flashScreenTimeout = null;
        }
    }

    /**
     * If the browser handle desktop notifications and
     * If the user wants to receive desktop notifications
     * create a new desktop notification
     */
    _showDesktopNotification() {
        if (this.state.configuration.desktop) {
            // check if the browser handle desktop notifications
            if (!("Notification" in window)) {
                return console.warn("Ce navigateur ne supporte pas les notifications desktop");
            }

            for (let data of this.state.notifications) {
                if(this._lastNotificationId < data.id && Notification.requestPermission()) {
                    // Request authorization
                    Notification.requestPermission().then((permission) => {
                        if(permission == 'granted') {
                            const notification = new Notification(data.title, {
                                icon: DESKTOP_NOTIFICATION_ICON,
                                body: data.text ? data.text : '',
                                tag: data.tag ? data.tag : data.id,
                            });

                            notification.onclick = _ => {
                                this._clearNotifications();
                                parent.focus();
                                window.focus();
                                notification.close();
                                if(data.route) {
                                     browserHistory.push(data.route);
                                }
                            };
                        }

                        // Start sound
                        this.setState({playing: Sound.status.PLAYING});

                        // Avoid starting again this notification
                        this._lastNotificationId = data.id
                    });
                }
            }
        }
    }

    render() {
        return (
            <div>
                {(this.state.configuration.flash) && this.state.flashScreen &&
                    <div className="Layout__FluxNotification__FlashScreen"></div>
                }
                {(this.state.configuration.sound) &&
                    <Sound
                        url={NOTIFICATION_SOUND}
                        playStatus={this.state.playing}
                        onFinishedPlaying={() => this.setState({playing: Sound.status.STOPPED})}
                    />
                }
            </div>
        );
    }

}
