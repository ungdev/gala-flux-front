import React from 'react';

import * as constants from '../../config/constants';
import NotificationActions from '../../actions/NotificationActions';
import ChatStore from '../../stores/ChatStore';
import UserStore from '../../stores/UserStore';
import TeamStore from '../../stores/TeamStore';
import AuthStore from '../../stores/AuthStore';

import DateTime from '../partials/DateTime.jsx';

import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';


require('../../styles/chat/ChatMessageList.scss');


/**
 * Show message list of specific channel
 * @param {string} channel If channel is not given, all authorized channel will be shown
 *
 */
export default class ChatMessageList extends React.Component {

    constructor() {
        super();

        this.state = {
            messages: [],
        };

        this.channel = '';

        this.ChatStoreToken = null;
        this.UserStoreToken = null;
        this.TeamStoreToken = null;

        this._updateData = this._updateData.bind(this);
        this._handleNewChannel = this._handleNewChannel.bind(this);
    }

    componentDidMount() {
        this._handleNewChannel();

        // listen the store change
        ChatStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        // clear the store
        ChatStore.unloadData(this.ChatStoreToken);
        UserStore.unloadData(this.UserStoreToken);
        TeamStore.unloadData(this.TeamStoreToken);

        // remove the store change listener
        ChatStore.removeChangeListener(this._updateData);
    }

    componentDidUpdate() {
        this.scrollArea.scrollTop = this.scrollArea.scrollHeight;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.channel != this.channel) {
            this._handleNewChannel(nextProps);
        }
    }

    /**
     * Update message list in the store then get it
     */
    _handleNewChannel(props) {
        // fill the store
        if(!props) {
            props = this.props;
        }

        ChatStore.loadData(props.channel ? { channel: props.channel } : { channel: ('public:'+AuthStore.team.name) })
        .then(data => {
            // ensure that last token doen't exist anymore.
            ChatStore.unloadData(this.ChatStoreToken);

            // save the component token
            this.ChatStoreToken = data.token;

            // Save current channel
            this.channel = this.props.channel;

            // Update messages
            this._updateData(props);
        })
        .catch(error => {
            NotificationActions.error('Une erreur s\'est produite pendant le chargement des messages', error);
        });
    }

    /**
     * Update message from store and request new data from user and team store
     */
    _updateData(props) {
        if(!props) {
            props = this.props;
        }
        let messages = ChatStore.find(props.channel ? { channel: props.channel } : { channel: ('public:'+AuthStore.team.name) });

        // Get user data
        UserStore.loadDataByRelation(messages, 'sender')
        .then(data => {
            // ensure that last token doen't exist anymore.
            UserStore.unloadData(this.UserStoreToken);
            // save the component token
            this.UserStoreToken = data.token;

            // Get team data
            return TeamStore.loadDataByRelation(UserStore.findByRelation(messages, 'sender'), 'team');
        })
        .then(data => {
            // ensure that last token doen't exist anymore.
            TeamStore.unloadData(this.TeamStoreToken);

            // save the component token
            this.TeamStoreToken = data.token;

            // Group messages
            let messagesGroups = [];
            let first = null;
            let last = null;
            for (let message of messages) {
                // Group if same sender and first message of the has been post less than 15 min ago, and last message less than 5 min ago
                if(last && first && last.sender == message.sender &&
                Math.abs((new Date(last.createdAt)).getTime() - (new Date(message.createdAt)).getTime()) < (5 * 60 * 1000) &&
                Math.abs((new Date(first.createdAt)).getTime() - (new Date(message.createdAt)).getTime()) < (15 * 60 * 1000) &&
                messagesGroups[messagesGroups.length - 1].length < 15) {
                    messagesGroups[messagesGroups.length - 1].push(message);
                }
                else {
                    messagesGroups.push([message]);
                    first = message;
                }
                last = message;
            }

            // Save messages
            this.setState({
                messages: messagesGroups,
            })
        })
        .catch(error => {
            NotificationActions.error('Une erreur s\'est produite pendant le re-chargement des messages', error);
        });
    }

    render() {
        return (
            <div className="ChatMessageList" ref={(scrollArea) => { this.scrollArea = scrollArea; }}>
                {
                    // For each message, create a Message component
                    this.state.messages.map((messageGroup, i) => {
                        let user = UserStore.findById(messageGroup[0].sender);
                        let team = user ? TeamStore.findById(user.team) : null;
                        return (
                            <div className={(AuthStore.user && user.id == AuthStore.user.id ? 'ChatMessageList__container--own' : 'ChatMessageList__container')} key={messageGroup[0].id}>
                                <Avatar
                                    className="ChatMessageList__avatar"
                                    src={(constants.avatarBasePath + messageGroup[0].sender)}
                                    backgroundColor="white"
                                    title={user.name}
                                    />
                                <div className="ChatMessageList__bubbles">
                                    <div className="ChatMessageList__bubbles__head">
                                        {(team && user.id != AuthStore.user.id ? (team.name + ' - ') : '')}
                                        <DateTime date={messageGroup[0].createdAt} />
                                    </div>
                                    {
                                        messageGroup.map((message, i) => {
                                            let date = new Date(message.createdAt);
                                            let title = (date.getDate() < 10 ? '0' : '') + date.getDate() +
                                                '/' + (date.getMonth() < 10 ? '0' : '') + date.getMonth() +
                                                '/' + (date.getYear()%100 < 10 ? '0' : '') + date.getYear()%100 +
                                                ' ' + (date.getHours() < 10 ? '0' : '') + date.getHours() +
                                                ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
                                                ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
                                            return (
                                                <Paper className="ChatMessageList__bubbles_bubble" title={title} key={message.id}>
                                                    {message.text}
                                                </Paper>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}
