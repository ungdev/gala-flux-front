import React from 'react';

import MessageForm from './MessageForm.jsx';
import MessageList from './MessageList.jsx';
require('../../styles/chat/Chat.scss');

export default class Chat extends React.Component {

    render() {
        return (
            <div className="chat">
                <MessageList />
                <MessageForm />
            </div>
        );
    }
}
