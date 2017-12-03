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

        this.lastNotificationId = -1;

        // We will wate 5 seconds before start flash screen, this will contain the timeout
        this.flashScreenTimeout = null;

        // binding
        this.updateData = this.updateData.bind(this);
        this.clearNotifications = this.clearNotifications.bind(this);
        this.showDesktopNotification = this.showDesktopNotification.bind(this);
    }

    componentDidMount() {
        // Listen store changes
        NotificationStore.addChangeListener(this.updateData);
        document.body.addEventListener('click', this.clearNotifications, true);
        document.body.addEventListener('keydown', this.clearNotifications, true);

    }

    componentWillUnmount() {
        // remove the store listener
        NotificationStore.removeChangeListener(this.updateData);
        document.body.removeEventListener('click', this.clearNotifications, true);
        document.body.removeEventListener('keydown', this.clearNotifications, true);
    }

    /**
     * Set the notification data in the component state
     */
    updateData() {
        let notifications = NotificationStore.notifications;
        this.setState({
            configuration: NotificationStore.configuration,
            notifications: notifications,
            flashScreen: (notifications.length == 0) ? false : this.state.flashScreen,
        });

        this.showDesktopNotification(notifications);

        // Start flash scren in 5 seconds
        if(notifications.length > 0 && !this.flashScreenTimeout && !this.state.flashScreen) {
            this.flashScreenTimeout = setTimeout(() => {
                this.flashScreenTimeout = null;
                if(this.state.notifications.length > 0) {
                    this.setState({flashScreen: true})
                }
            }, 5000);
        }
    }

    clearNotifications() {
        NotificationActions.clearNotifications();
        if(this.flashScreenTimeout) {
            clearTimeout(this.flashScreenTimeout);
            this.flashScreenTimeout = null;
        }
    }

    /**
     * If the browser handle desktop notifications and
     * If the user wants to receive desktop notifications
     * create a new desktop notification
     */
    showDesktopNotification() {
        if (this.state.configuration.desktop) {
            // check if the browser handle desktop notifications
            if (!("Notification" in window)) {
                return console.warn("Ce navigateur ne supporte pas les notifications desktop");
            }

            for (let data of this.state.notifications) {
                if(this.lastNotificationId < data.id && Notification.requestPermission()) {
                    // Request authorization
                    Notification.requestPermission().then((permission) => {
                        if(permission == 'granted') {
                            const notification = new Notification(data.title, {
                                icon: DESKTOP_NOTIFICATION_ICON,
                                body: data.text ? data.text : '',
                                tag: data.tag ? data.tag : data.id,
                            });

                            notification.onclick = _ => {
                                this.clearNotifications();
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
                        this.lastNotificationId = data.id
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
