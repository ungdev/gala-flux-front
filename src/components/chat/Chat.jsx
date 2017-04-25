import React from 'react';

import ChatMessageForm from './ChatMessageForm.jsx';
import ChatMessageList from './ChatMessageList.jsx';

require('../../styles/chat/Chat.scss');

export default class Chat extends React.Component {

    render() {
        return (
            <div className="Chat">
                <ChatMessageList/>
                <ChatMessageForm />
            </div>
        );
    }
}
