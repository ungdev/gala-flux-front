import React from 'react';
import router from '../../router';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ContentSendIcon from 'material-ui/svg-icons/content/send';
import ChatService from '../../services/ChatService';
import AuthStore from '../../stores/AuthStore';
import NotificationActions from '../../actions/NotificationActions';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import SelectableList from '../partials/SelectableList.jsx';

require('../../styles/chat/ChatMenu.scss');

/**
 * This component will print the list of available channels and let user change page
 * @param {object} route The route state
 * @param {function(channel)} onChange will be called when an item is selelcted
 */
export default class ChatMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            channels: {
                private: [],
                group: [],
                public: [],
            },
            channel: '',
        };

        // binding
        this._handleChange = this._handleChange.bind(this);
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
    }

    componentWillReceiveProps(nextProps) {
        let route = nextProps.route;
        // Re-render every route change
        if(route.name == 'chat.channel') {
            if(this.state.channel != route.params.channel) {
                this.setState({
                    channel: route.params.channel,
                });
            }
        }
        else if(AuthStore.team && this.state.channel != ('public:'+AuthStore.team.name)) {
            this.setState({
                channel: 'public:'+AuthStore.team.name,
            });
        }
    }

    _handleChange(channel) {
        router.navigate('chat.channel', {channel: channel});
        if(this.props.onChange) {
            this.props.onChange(channel);
        }
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
                                <ListItem key={i} value={channel} className="ChatMenu__channel">{(channel.split(':')[1])}</ListItem>
                            )
                        })
                    }


                    { this.state.channels.group.length > 0 &&
                        <div>
                            <Divider/>
                            <Subheader className="ChatMenu__subheader">Groupe</Subheader>
                        </div>
                    }
                    {
                        this.state.channels.group.map((channel, i) => {
                            return (
                                <ListItem key={i} value={channel} className="ChatMenu__channel">{(channel.split(':')[1])}</ListItem>
                            )
                        })
                    }


                    { this.state.channels.private.length > 0 &&
                        <div>
                            <Divider/>
                            <Subheader className="ChatMenu__subheader">Privé</Subheader>
                        </div>
                    }
                    {
                        this.state.channels.private.map((channel, i) => {
                            return (
                                <ListItem key={i} value={channel} className="ChatMenu__channel">{(channel.split(':')[1])}</ListItem>
                            )
                        })
                    }
                </SelectableList>
            </div>
        );
    }
}
