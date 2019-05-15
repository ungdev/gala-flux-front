import React from 'react';

import * as constants from 'config/constants';
import NotificationActions from 'actions/NotificationActions';
import ChatActions from 'actions/ChatActions';
import ChatStore from 'stores/ChatStore';
import UserStore from 'stores/UserStore';
import TeamStore from 'stores/TeamStore';
import AuthStore from 'stores/AuthStore';

import DateTime from 'components/partials/DateTime.jsx';
import CenteredMessage from 'components/partials/CenteredMessage.jsx';

import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';

require('styles/chat/ChatMessageList.scss');

/**
 * Show message list of specific channel
 * @param {string|null} channel If channel is null, all authorized channel will be shown
 *
 */
export default class ChatMessageList extends React.Component {

    constructor() {
        super();

        this.state = {
            messages: [],
            loading: true,
        };

        this.channel = '';

        this.scrollBottom = 0;
        this.clientHeight = 0;

        this.ChatStoreToken = null;
        this.UserStoreToken = null;
        this.TeamStoreToken = null;

        this._updateData = this._updateData.bind(this);
        this._handleNewChannel = this._handleNewChannel.bind(this);
        this._handleWindowResize = this._handleWindowResize.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
    }

    componentDidMount() {
        this._handleNewChannel();

        // Init scroll listening
        window.addEventListener("resize", this._handleWindowResize);
        this.scrollArea.addEventListener("scroll", this._handleScroll);
        this.clientHeight = this.scrollArea.clientHeight;
        this.scrollBottom = 0;

        // listen the store change
        ChatStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        // clear the store
        ChatStore.unloadData(this.ChatStoreToken);
        UserStore.unloadData(this.UserStoreToken);
        TeamStore.unloadData(this.TeamStoreToken);

        // clear scroll listening
        window.removeEventListener("resize", this._handleWindowResize);
        this.scrollArea.removeEventListener("scroll", this._handleScroll);
        // remove the store change listener
        ChatStore.removeChangeListener(this._updateData);
    }

    componentDidUpdate() {
        this.scrollArea.scrollTop = this.scrollArea.scrollHeight;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.channel !== this.channel) {
            this.setState({loading: true})
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

        ChatStore.loadData(this._getChannelFilter(props))
        .then(data => {
            // ensure that last token doen't exist anymore.
            ChatStore.unloadData(this.ChatStoreToken);

            // save the component token
            this.ChatStoreToken = data.token;

            // Save current channel
            this.channel = this.props.channel;

            return UserStore.loadData(null);
        })
        .then(data => {
            UserStore.unloadData(this.UserStoreToken);
            this.UserStoreToken = data.token;
            return TeamStore.loadData(null);
        })
        .then(data => {
            TeamStore.unloadData(this.TeamStoreToken);
            this.TeamStoreToken = data.token;

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
        let messages = ChatStore.find(this._getChannelFilter(this.props));

        // Group messages
        let messagesGroups = [];
        let first = null;
        let last = null;
        for (let message of messages) {
            // Group if same sender and first message of the has been post less than 15 min ago, and last message less than 5 min ago
            if(last && first && last.sender == message.sender &&
            Math.abs((new Date(last.createdAt)).getTime() - (new Date(message.createdAt)).getTime()) < (5 * 60 * 1000) &&
            Math.abs((new Date(first.createdAt)).getTime() - (new Date(message.createdAt)).getTime()) < (15 * 60 * 1000) &&
            messagesGroups[messagesGroups.length - 1].length < 15
            && last.channel == message.channel) {
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
            loading: false,
        })
    }

    /**
     * Generate channel filter according to props
     */
    _getChannelFilter(props) {
        if(props.channel === null) {
            return null;
        }
        else if(props.channel) {
            return { channel: props.channel };
        }
        else {
            if(localStorage.getItem('chat/lastChannel')) {
                return { channel: localStorage.getItem('chat/lastChannel') };
            }
            return { channel: ('public:'+AuthStore.team.name) };
        }
    }

    /**
     * On Window resize, keep bottom scroll position to keep message position when keyboard show on mobile
     */
    _handleWindowResize(e) {
        if(this.scrollBottom != 0 && this.scrollArea.clientHeight) {
            this.scrollArea.scrollTop = this.scrollBottom - this.scrollArea.clientHeight;
        }
        this.clientHeight = this.scrollArea.clientHeight;
        this.scrollBottom = this.scrollArea.scrollTop + this.scrollArea.clientHeight;
    }

    /**
     * On scroll, register the new bottom scroll position
     */
    _handleScroll(e) {
        if(this.clientHeight == e.target.clientHeight) {
            this.scrollBottom = this.scrollArea.scrollTop + this.scrollArea.clientHeight;
        }
        this.clientHeight = this.scrollArea.clientHeight;
    }

    render() {
        return (
            <div className="ChatMessageList" ref={(scrollArea) => { this.scrollArea = scrollArea; }} onClick={() => ChatActions.viewMessages(this.channel)}>
                { this.state.loading ?
                    <CenteredMessage>Chargement...</CenteredMessage>
                :

                    ( this.state.messages.length == 0 ?
                        <CenteredMessage>Aucun message</CenteredMessage>
                    :
                        // For each message, create a Message component
                        this.state.messages.map((messageGroup, i) => {
                            let user = UserStore.findById(messageGroup[0].sender) || {name: 'Utilisateur supprimé'};
                            let team = TeamStore.findById(user.team) || {name: 'Utilisateur supprimé'};
                            return (
                                <div className={(AuthStore.user && user.id === AuthStore.user.id ? 'ChatMessageList__container--own' : 'ChatMessageList__container')} key={messageGroup[0].id}>
                                    <Avatar
                                        className="ChatMessageList__avatar"
                                        src={(constants.avatarBasePath + messageGroup[0].sender)}
                                        backgroundColor="white"
                                        title={user.name}
                                        />
                                    <div className="ChatMessageList__bubbles">
                                        <div className="ChatMessageList__bubbles__head">
                                            {(team && user.id !== AuthStore.user.id ? (team.name + ' - ') : '')}
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
                    )
                }
            </div>
        );
    }
}
