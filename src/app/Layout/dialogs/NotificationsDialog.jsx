import React from 'react';

import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';
import NotificationActions from 'actions/NotificationActions';

import Dialog from 'app/components/ResponsiveDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';

export default class NotificationsDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            configuration: NotificationStore.configuration,
        };

        // binding
        this._updateParameters = this._updateParameters.bind(this);
        this._toggleParameter = this._toggleParameter.bind(this);
        this._setNotificationsConfiguration = this._setNotificationsConfiguration.bind(this);
    }

    componentDidMount() {
        // Listen store events
        NotificationStore.addChangeListener(this._setNotificationsConfiguration);
        // init the notifications object in the state
        this._setNotificationsConfiguration();
    }

    componentWillUnmount() {
        // remove the store listener
        NotificationStore.removeChangeListener(this._setNotificationsConfiguration);
    }

    /**
     * Update the notifications in the component state with the values from AuthStore
     */
    _setNotificationsConfiguration() {
        this.setState({ configuration: NotificationStore.configuration });
    }

    /**
     * Update the notification parameters in the localStorage
     */
    _updateParameters() {
        let conf = this.state.configuration;
        conf['submitted'] = true;
        NotificationActions.updateConfiguration(conf);
        this.props.close();
    }

    /**
     * Toggle the value of a parameter of the notifications configuration
     *
     * @param {string} parameter: the parameter to toggle
     */
    _toggleParameter(parameter) {
        let state = this.state;
        state.configuration[parameter] = !state.configuration[parameter];
        this.setState(state);
    }

    /**
     * Toogle state on a channel
     *
     * @param {string} channel Channel name
     */
    _onChannelClick(channel) {
        let channels = this.state.configuration.channel;
        switch (channels[channel]) {
            case 'hide':
                return channels[channel] = 'notify';
            case 'show':
                return channels[channel] = 'hide';
            default:
            case 'notify':
                return channels[channel] = 'show';
        }
        this.setState({channel: channels})
    }

    render() {
        const actions = [
            <FlatButton
                label={ this.props.welcome ? 'Plus tard' :  'Annuler'}
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
                title={ this.props.welcome ? 'Bienvenue sur Flux !' :  'Notifications'}
                actions={actions}
                modal={false}
                open={true}
                contentStyle={{maxWidth: '600px'}}
                onRequestClose={this.props.close}
            >
                { this.props.welcome ?
                    <div>
                        <p></p>
                        <p>Comme c'est la première fois que vous vous connectez depuis cet appareil, nous vous proposons de parametrer dès maintenant les notifications.</p>
                        <p>Notez que vous pouvez à tous moment modifier ces paramètres en cliquant sur votre photo de profil en haut à droite de l'écran.</p>
                    </div>
                    :
                    <p>Modification des paramètres de notifications</p>
                }
                <List>
                    { !global.Android ?
                        <div>
                            <ListItem
                                className="ToggleListItem"
                                primaryText="Son"
                                secondaryText="Jouer un son lors des notifications"
                                onTouchTap={_ => this._toggleParameter('sound')}
                                rightIcon={<Toggle toggled={this.state.configuration.sound}/>}
                            />
                            <ListItem
                                className="ToggleListItem"
                                primaryText="Écran clignotant"
                                secondaryText="Faire clignoter l'écran lors des notifications"
                                onTouchTap={_ => this._toggleParameter('flash')}
                                rightIcon={<Toggle toggled={this.state.configuration.flash}/>}
                            />
                            <ListItem
                                className="ToggleListItem"
                                primaryText="Notifications pour bureau"
                                secondaryText="Recevoir les notifications sur votre bureau"
                                onTouchTap={_ => this._toggleParameter('desktop')}
                                rightIcon={<Toggle toggled={this.state.configuration.desktop}/>}
                            />
                        </div>
                    :
                        <ListItem
                            className="ToggleListItem"
                            primaryText="Notifications Android"
                            secondaryText="Recevoir des notifications Android"
                            onTouchTap={_ => this._toggleParameter('android')}
                            rightIcon={<Toggle toggled={this.state.configuration.android}/>}
                        />
                    }
                    <ListItem
                        className="ToggleListItem"
                        primaryText="Nouvelles alertes"
                        secondaryText="Recevoir des notifications pour les nouvelles alertes"
                        onTouchTap={_ => this._toggleParameter('alert')}
                        rightIcon={<Toggle toggled={this.state.configuration.alert}/>}
                    />
                </List>
                <Divider />
                <h3>Channels du chat</h3>
                <List>
                    {this.state.configuration && this.state.configuration.channel &&
                        Object.keys(this.state.configuration.channel).sort((a,b) => a.replace('public:','0:').localeCompare(b.replace('public:','0:'))).map((channel, i) => {

                            let primaryText = channel.split(':')[1];
                            switch(channel.split(':')[0]) {
                                case 'group': primaryText = 'Groupe : ' + channel.split(':')[1]; break;
                                case 'private': primaryText = 'Privé : ' + channel.split(':')[1]; break;
                            }

                            let secondaryText = 'Notifications activées';
                            if (this.state.configuration.channel[channel] == 'hide') secondaryText = 'Channel caché';
                            if (this.state.configuration.channel[channel] == 'show') secondaryText = 'Ne pas notifier';


                            return (
                            <ListItem
                                key={i}
                                className="ToggleListItem"
                                style={this.state.configuration.channel[channel] == 'hide' ? {color: 'gray'} : {}}
                                primaryText={this.state.configuration.channel[channel] == 'hide' ? <del>{primaryText}</del> : primaryText}
                                secondaryText={secondaryText}
                                onTouchTap={_ => this._onChannelClick(channel)}
                                rightIcon={<Toggle toggled={this.state.configuration.channel[channel] == 'notify'} disabled={this.state.configuration.channel[channel] == 'hide'}/>}
                            />)
                        })
                    }
                </List>
            </Dialog>
        );
    }

}
