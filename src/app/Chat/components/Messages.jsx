import React from 'react';

import * as constants from 'config/constants';
import NotificationActions from 'actions/NotificationActions';
import ChatActions from 'actions/ChatActions';
import AuthStore from 'stores/AuthStore';
import DataLoader from "app/components/DataLoader.jsx";

import DateTime from 'app/components/DateTime.jsx';
import CenteredMessage from 'app/components/CenteredMessage.jsx';

import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';

require('./Messages.scss');

/**
 * Show message list of specific channel
 * @param {string|null} channel If channel is null, all authorized channel will be shown
 *
 */
export default class Messages extends React.Component {

    constructor() {
        super();

        this.state = {
            messages: [],
            loading: true,
        };

        this.channel = '';

        this.scrollBottom = 0;
        this.clientHeight = 0;

        this._handleWindowResize = this._handleWindowResize.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
        this.handleDatastoreChange = this.handleDatastoreChange.bind(this);
    }

    /**
     * Update state when store are updated
     */
    handleDatastoreChange(datastore) {
        // Group messages
        let messagesGroups = [];
        let first = null;
        let last = null;
        for (let message of datastore.Message.values()) {
            // Group if same sender and first message of the has been post less than 15 min ago, and last message less than 5 min ago
            if(last && first && last.userId == message.userId &&
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
            users: datastore.User,
            teams: datastore.Team,
            loading: false,
        });
    }

    componentDidUpdate() {
        // Run too soon without setImmediate
        setImmediate(() => {
            this.scrollArea.scrollTop = this.scrollArea.scrollHeight
        });
    }


    componentDidMount() {
        // Init scroll listening
        window.addEventListener("resize", this._handleWindowResize);
        this.scrollArea.addEventListener("scroll", this._handleScroll);
        this.clientHeight = this.scrollArea.clientHeight;
        this.scrollBottom = 0;
    }

    componentWillUnmount() {
        // clear scroll listening
        window.removeEventListener("resize", this._handleWindowResize);
        this.scrollArea.removeEventListener("scroll", this._handleScroll);
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
            <div className="Chat__Message" ref={(scrollArea) => { this.scrollArea = scrollArea; }} onClick={() => ChatActions.viewMessages(this.channel)}>
                <DataLoader
                    filters={new Map([
                        ['Message', this._getChannelFilter(this.props) ],
                        ['User', (datastore) => ({id: datastore.Message.map(message => message.userId)}) ],
                        ['Team', (datastore) => ({id: datastore.User.map(user => user.teamId)}) ],
                    ])}
                    onChange={ datastore => this.handleDatastoreChange(datastore) }
                    loadingContent={<CenteredMessage>Chargement...</CenteredMessage>}
                >
                    { () => ( this.state.messages.length == 0 ?
                            <CenteredMessage>Aucun message</CenteredMessage>
                    :
                        // For each message, create a Message component
                        this.state.messages.map((messageGroup, i) => {
                            let user = this.state.users.get(messageGroup[0].userId) || {name: 'Utilisateur supprimé'};
                            let team = this.state.teams.get(user.teamId) || {name: 'Utilisateur supprimé'};
                            return (
                                <div className={(AuthStore.user && user.id === AuthStore.user.id ? 'Chat__Message__container--own' : 'Chat__Message__container')} key={messageGroup[0].id}>
                                    <Avatar
                                        className="Chat__Message__avatar"
                                        src={(constants.avatarBasePath + messageGroup[0].userId + '?u=' + user.updatedAt)}
                                        title={user.name}
                                        />
                                    <div className="Chat__Message__bubbles">
                                        <div className="Chat__Message__bubbles__head">
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
                                                    <Paper className="Chat__Message__bubbles_bubble" title={title} key={message.id}>
                                                        {message.text}
                                                    </Paper>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    )}
                </DataLoader>
            </div>
        );
    }
}
