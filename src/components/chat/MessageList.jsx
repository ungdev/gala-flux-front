import React from 'react';

import ChatStore from '../../stores/ChatStore';
import ChatService from '../../services/ChatService';
import ChatActions from '../../actions/ChatActions';

import Message from './Message.jsx';

export default class MessageList extends React.Component {

    constructor() {
        super();

        this.state = {
            messages: []
        };

        this._handleMessage = this._handleMessage.bind(this);
        this._onChatStoreChange = this._onChatStoreChange.bind(this);
    }

    componentDidMount() {
        // listen the store change
        ChatStore.addChangeListener(this._onChatStoreChange);
        // get the messages to init the store
        ChatService.getMessages(err => {
            console.log("get messages error : ", err);
        });
        // listen to the new messages. On new message, trigger an action
        iosocket.on('message', this._handleMessage);
    }

    componentWillUnmount() {
        // remove the store change
        ChatStore.removeChangeListener(this._onChatStoreChange);
        // remove the socket io listener
        iosocket.off('message', this._handleMessage);
    }

    /**
     * Trigger an action to handle the new message
     *
     * @param e
     */
    _handleMessage(e) {
        ChatActions.newMessage(e.data);
    }

    /**
     * Update the messages in the state
     */
    _onChatStoreChange() {
        if (this.state) {
            this.setState({messages : ChatStore.messages});
        }
    }

    render() {
        return (
            <ul>
                {
                    // For each message, create a Message component
                    this.state.messages.map((message, i) => {
                        return <Message message={message} key={i} />
                    })
                }
            </ul>
        );
    }

}