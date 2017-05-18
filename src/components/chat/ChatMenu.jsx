import React from 'react';
import router from 'router';

import ChatService from 'services/ChatService';
import ChatStore from 'stores/ChatStore';
import ChatActions from 'actions/ChatActions';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import SelectableList from 'components/partials/SelectableList.jsx';
import ChatMenuItem from 'components/chat/ChatMenuItem.jsx';
import { ListItem } from 'material-ui/List';

require('styles/chat/ChatMenu.scss');

/**
 * This component will print the list of available channels and let user change page
 * @param {object} route The route state
 * @param {function(channel)} onChange will be called when an item is selelcted
 * @param {bool} selectDefault If true a default channel will be selected when route is not found (default: false)
 */
export default class ChatMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            channels: {
                private: [],
                group: [],
                public: []
            },
            channel: '',
            newMessages: {}
        };

        // binding
        this._handleChange = this._handleChange.bind(this);
        this._updateChannel = this._updateChannel.bind(this);
        this._updateNewMessages = this._updateNewMessages.bind(this);
    }

    componentDidMount() {

        // Pull channel list
        ChatService.getChannels()
        .then((channels) => {
            let newChannels = {
                private: [],
                group: [],
                public: [],
            };
            for (let channel of channels) {
                let channelParts = channel.split(':');
                // Add to the beginning of the list if this is the channel of the team
                if(AuthStore.team && (channelParts[1] == AuthStore.team.name || channelParts[1] == AuthStore.team.group)) {
                    newChannels[channelParts[0]].unshift(channel);
                }
                else {
                    newChannels[channelParts[0]].push(channel);
                }
            }
            this.setState({channels: newChannels});
        })
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant le chargement de la liste des channels', error);
        });

        // Select channel
        this._updateChannel(this.props.route);

        // Listen store change
        ChatStore.addChangeListener(this._updateNewMessages);
    }

    componentWillUnmount() {
        // remove the store change listener
        ChatStore.removeChangeListener(this._updateNewMessages);
    }

    componentWillReceiveProps(nextProps) {
        this._updateChannel(nextProps.route);
    }

    /**
     * Set the new messages counters in the state
     */
    _updateNewMessages() {
        this.setState({ newMessages: ChatStore.newMessages });
    }

    /**
     * Update the channel according to the given route
     * @param {Object} route
     */
    _updateChannel(route) {
        // Re-render every route change
        if(route.name == 'chat.channel') {
            if(this.state.channel != route.params.channel) {
                this.setState({
                    channel: route.params.channel,
                });
            }
        }
        else if(this.props.selectDefault && AuthStore.team && this.state.channel != ('public:'+AuthStore.team.name)) {
            this.setState({
                channel: 'public:'+AuthStore.team.name,
            });
        }
        else {
            this.setState({
                channel: '',
            });
        }
    }

    _handleChange(channel) {
        router.navigate('chat.channel', {channel: channel});
        if(this.props.onChange) {
            this.props.onChange(channel);
        }
    }

    /**
     * Call the ChatStore method to reset the new messages counter of this channel
     * @param {string} channel
     */
    _messagesViewed(channel) {
        ChatActions.viewMessages(channel);
    }

    render() {

        return (
            <div className="ChatMenu">
                <SelectableList onChange={this._handleChange} value={this.state.channel}>

                    { this.state.channels.public.length > 0 &&
                        <Subheader className="ChatMenu__subheader">Publique</Subheader>
                    }
                    {
                        this.state.channels.public.map((channel, i) => {
                            return (
                                <ListItem key={i} value={channel} className="ChatMenu__channel" onClick={_ => this._messagesViewed(channel)}>
                                    <ChatMenuItem  newMessages={this.state.newMessages[channel]} channel={channel} />
                                </ListItem>
                            )
                        })
                    }


                    { this.state.channels.group.length > 0 &&
                        <div>
                            <Divider className="hide-xs"/>
                            <Subheader className="ChatMenu__subheader">Groupe</Subheader>
                        </div>
                    }
                    {
                        this.state.channels.group.map((channel, i) => {
                            return (
                                <ListItem key={i} value={channel} className="ChatMenu__channel">
                                    <ChatMenuItem  newMessages={this.state.newMessages[channel]} channel={channel} messagesViewed={_ => this._messagesViewed(channel)} />
                                </ListItem>
                            )
                        })
                    }


                    { this.state.channels.private.length > 0 &&
                        <div>
                            <Divider className="hide-xs"/>
                            <Subheader className="ChatMenu__subheader">Privé</Subheader>
                        </div>
                    }
                    {
                        this.state.channels.private.map((channel, i) => {
                            return (
                                <ListItem key={i} value={channel} className="ChatMenu__channel">
                                    <ChatMenuItem  newMessages={this.state.newMessages[channel]} channel={channel} messagesViewed={_ => this._messagesViewed(channel)} />
                                </ListItem>
                            )
                        })
                    }
                </SelectableList>
            </div>
        );
    }
}
