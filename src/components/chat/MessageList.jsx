import React from 'react';
import ChatStore from '../../stores/ChatStore';
import Message from './Message.jsx';

export default class MessageList extends React.Component {

    constructor() {
        super();

        this.state = {
            messages: []
        };

        this.ChatStoreToken = null;

        this._setMessages = this._setMessages.bind(this);
    }

    componentDidMount() {
        // file the store
        ChatStore.loadData(null)
            .then(data => {
                // ensure that last token doen't exist anymore.
                ChatStore.unloadData(this.ChatStoreToken);
                // save the component token
                this.ChatStoreToken = data.token;
            })
            .catch(error => console.log("load messages error", error));
        // listen the store change
        ChatStore.addChangeListener(this._setMessages);
    }

    componentWillUnmount() {
        // clear the store
        ChatStore.unloadData(this.ChatStoreToken);
        // remove the store change
        ChatStore.removeChangeListener(this._setMessages);
    }

    /**
     * Update the messages in the state
     */
    _setMessages() {
        this.setState({ messages: ChatStore.messages });
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
