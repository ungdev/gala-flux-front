import React from 'react';
import { browserHistory } from 'react-router'

import MessageService from 'services/MessageService';
import MessageStore from 'stores/MessageStore';
import NotificationStore from 'stores/NotificationStore';
import ChatActions from 'actions/ChatActions';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import SelectableList from 'app/components/SelectableList.jsx';
import FontAwesome from 'react-fontawesome';
import { ListItem } from 'material-ui/List';
import ReactTooltip from 'react-tooltip'

require('./Channels.scss');

/**
 * This component will print the list of available channels and let user change page
 * @param {string} channel The selected channel or null
 * @param {bool} selectDefault If true a default channel will be selected when route is not found (default: false)
 */
export default class Channels extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            channels: {
                private: [],
                group: [],
                public: []
            },
            channelOrder: {},
            channel: null,
            newMessages: {},
            overNewMessageCount: 0,
            underNewMessageCount: 0,
        };

        // binding
        this._handleScroll = this._handleScroll.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._updateChannel = this._updateChannel.bind(this);
        this._updateNewMessages = this._updateNewMessages.bind(this);
    }

    componentDidMount() {

        // Pull channel list
        MessageService.getChannels()
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
            this.setState({channels: newChannels}, () => {
                this._updateNewMessages();
            });
        })
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant le chargement de la liste des channels', error);
        });

        // Select channel
        this._updateChannel();

        // Listen store change
        NotificationStore.addChangeListener(this._updateNewMessages);
    }

    componentWillUnmount() {
        // remove the store change listener
        NotificationStore.removeChangeListener(this._updateNewMessages);
    }

    componentWillReceiveProps(nextProps) {
        this._updateChannel(nextProps.channel);
    }

    componentDidUpdate() {
        this._handleScroll();
    }

    /**
     * Set the new messages counters in the state
     */
    _updateNewMessages() {
        let channelOrder = [];
        let channels = NotificationStore.configuration.channel;
        for (let channel in channels) {
            if(channels[channel] != 'hide') {
                // Create channel label
                let label = channel.split(':')[1];
                let leftIcon = '';
                let notify = true;
                if(channel.split(':')[0] == 'private') {
                    leftIcon = 'user-secret';
                }
                else if(channel.split(':')[0] == 'group') {
                    leftIcon = 'bullhorn';
                }
                if(channels[channel] != 'notify') {
                    notify = false;
                }

                channelOrder.push({channel, label, leftIcon, notify});
            }
        }
        channelOrder = channelOrder.sort((a,b) => {
            let chanA = a.channel;
            let chanB = b.channel;

            // Personnal channel first
            if(AuthStore.team) {
                chanA = (a.channel.split(':')[1] == AuthStore.team.name ? '0' : '1') +  chanA;
                chanB = (b.channel.split(':')[1] == AuthStore.team.name ? '0' : '1') +  chanB;
            }

            // General first
            chanA = (a.channel.split(':')[1] == 'General' ? '0' : '1') +  chanA;
            chanB = (b.channel.split(':')[1] == 'General' ? '0' : '1') +  chanB;

            // order public, group, private
            chanA = (a.channel.split(':')[0] == 'group' ? '0' : '1') +  chanA;
            chanB = (b.channel.split(':')[0] == 'group' ? '0' : '1') +  chanB;
            chanA = (a.channel.split(':')[0] == 'public' ? '0' : '1') +  chanA;
            chanB = (b.channel.split(':')[0] == 'public' ? '0' : '1') +  chanB;

            // put 'notify' first
            chanA = (a.notify ? '0' : '1') + chanA;
            chanB = (b.notify ? '0' : '1') + chanB;

            return chanA.localeCompare(chanB);
        })

        this.setState({ newMessages: NotificationStore.newMessageCounts, channelOrder });
    }

    /**
     * Update the channel according to the given route
     * @param {string} channel
     */
    _updateChannel(channel) {
        if(!channel) channel = this.props.channel;
        // Re-render every route change
        if(channel !== null) {
            if(this.state.channel != channel) {
                this.setState({
                    channel: channel,
                });
                localStorage.setItem('chat/lastChannel', channel);
            }
        }
        else if(this.props.selectDefault && localStorage.getItem('chat/lastChannel') && this.state.channel != localStorage.getItem('chat/lastChannel')) {
            this.setState({
                channel: localStorage.getItem('chat/lastChannel'),
            });
        }
        else if(this.props.selectDefault && AuthStore.team && this.state.channel != ('public:'+AuthStore.team.name)) {
            this.setState({
                channel: 'public:'+AuthStore.team.name,
            });
            localStorage.setItem('chat/lastChannel', 'public:'+AuthStore.team.name);
        }
        else {
            this.setState({
                channel: '',
            });
        }
    }

    _handleChange(channel) {
        browserHistory.push('/chat/'+channel);
    }

    _handleScroll(e) {
        let target = this.scrollArea;
        if(target) {
            let over = 0;
            let under = 0;

            const scrollAreaTop = target.getBoundingClientRect().top;
            const scrollAreaBottom = target.getBoundingClientRect().bottom;

            // Calculate number of message under and over the view in the scroll area
            let elements = target.getElementsByClassName('NotificationScrollIndicatorLine');

            for (let i = 0 ; i < elements.length ; i++) {
                let el = elements[i];
                let rect = el.getBoundingClientRect();
                if(el.dataset && el.dataset.count && rect && rect.bottom != 0) {
                    if(rect.top - scrollAreaTop < 0) {
                        over += parseInt(el.dataset.count) || 0;
                    }
                    else if(scrollAreaBottom - rect.bottom < 0) {
                        under += parseInt(el.dataset.count) || 0;
                    }
                    if(el.dataset.count==24) {
                    }
                }
            }

            // update state if necessary
            let state = {};
            if(this.state.overNewMessageCount != over) {
                state.overNewMessageCount = over;
            }
            if(this.state.underNewMessageCount != under) {
                state.underNewMessageCount = under;
            }
            if(Object.keys(state) != 0) {
                this.setState(state);
            }
        }
    }

    /**
     * Call the MessageStore method to reset the new messages counter of this channel
     * @param {string} channel
     */
    _messagesViewed(channel) {
        ChatActions.viewMessages(channel);
    }

    render() {

        return (
            <div className="Chat__Channels" onScroll={this._handleScroll} ref={(el) => { this.scrollArea = el; }}>
                {this.state.overNewMessageCount != 0 &&
                    <div className="NotificationScrollIndicator--top">
                        <div>
                            {this.state.overNewMessageCount} Non lus ↑
                        </div>
                    </div>
                }
                <SelectableList onChange={this._handleChange} value={this.state.channel}>
                    {
                        Object.keys(this.state.channelOrder).map((key, i) => {
                            let channel = this.state.channelOrder[key].channel;
                            return (
                                <ListItem key={i} value={channel} className="Chat__Channels__channel" onClick={_ => this._messagesViewed(channel)}>
                                    { this.state.channelOrder[key].notify && this.state.newMessages[channel] > 0 &&
                                        <span className="Notification_bubble">{this.state.newMessages[channel]}</span>
                                    }
                                    {!this.state.channelOrder[key].notify &&
                                        <span className="pull-right"> <FontAwesome name="bell-slash-o" /></span>
                                    }
                                    <div data-count={((this.state.channelOrder[key].notify && this.state.newMessages[channel]) || 0)} className="Chat__Channels__channel__nameContainer NotificationScrollIndicatorLine">

                                        {this.state.channelOrder[key].leftIcon &&
                                            <span><FontAwesome name={this.state.channelOrder[key].leftIcon} /> </span>
                                        }

                                        {this.state.newMessages[channel] > 0 ?
                                            <strong>{this.state.channelOrder[key].label}</strong>
                                            :
                                            this.state.channelOrder[key].label
                                        }
                                    </div>
                                </ListItem>
                            )
                        })
                    }
                </SelectableList>

                {this.state.underNewMessageCount != 0 &&
                    <div className="NotificationScrollIndicator--bottom">
                        <div>
                            {this.state.underNewMessageCount} Non lus ↓
                        </div>
                    </div>
                }
            </div>
        );
    }
}
