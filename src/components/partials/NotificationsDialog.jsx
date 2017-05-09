import React from 'react';

import AuthStore from '../../stores/AuthStore';

import Dialog from 'components/partials/ResponsiveDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

export default class NotificationsDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            notifications: {
                sound: true,
                flash: true,
                desktop: true
            }
        };

        // binding
        this._updateParameters = this._updateParameters.bind(this);
        this._toggleParameter = this._toggleParameter.bind(this);
        this._setNotificationsConfiguration = this._setNotificationsConfiguration.bind(this);
    }

    componentDidMount() {
        // Listen store events
        AuthStore.addChangeListener(this._setNotificationsConfiguration);
        // init the notifications object in the state
        this._setNotificationsConfiguration();
    }

    componentWillUnmount() {
        // remove the store listener
        AuthStore.removeChangeListener(this._setNotificationsConfiguration);
    }

    /**
     * Update the notifications in the component state with the values from AuthStore
     */
    _setNotificationsConfiguration() {
        this.setState({ notifications: AuthStore.notifications });
    }

    /**
     * Update the notification parameters in the localStorage
     */
    _updateParameters() {
        AuthStore.notifications = this.state.notifications;
        this.props.close();
    }

    /**
     * Toggle the value of a parameter of the notifications configuration
     *
     * @param {string} parameter: the parameter to toggle
     */
    _toggleParameter(parameter) {
        let state = this.state;
        state.notifications[parameter] = !state.notifications[parameter];
        this.setState(state);
    }

    render() {
        const actions = [
            <FlatButton
                label="Annuler"
                primary={true}
                onTouchTap={this.props.close}
            />,
            <FlatButton
                label="Valider"
                primary={true}
                onTouchTap={this._updateParameters}
            />,
        ];

        return (
            <Dialog
                title="Notifications"
                actions={actions}
                modal={false}
                open={true}
                onRequestClose={this.props.close}
            >
                <p>
                    Modification des paramètres de notifications.
                </p>
                <div>
                    <Toggle
                        label="Jouer un son lors des notifications"
                        toggled={this.state.notifications.sound}
                        onToggle={_ => this._toggleParameter('sound')}
                    />
                    <Toggle
                        label="Ecran clignotant lors des notifications"
                        toggled={this.state.notifications.flash}
                        onToggle={_ => this._toggleParameter('flash')}
                    />
                    <Toggle
                        label="Notifications sur votre ordinateur"
                        toggled={this.state.notifications.desktop}
                        onToggle={_ => this._toggleParameter('desktop')}
                    />
                </div>
            </Dialog>
        );
    }

}