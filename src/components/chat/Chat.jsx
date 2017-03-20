import React from 'react';

import MessageForm from './MessageForm.jsx';
import MessageList from './MessageList.jsx';

export default class Chat extends React.Component {

    render() {
        const style = {
            chatBox: {
                border: "1px solid black",
                padding: 10
            }
        };

        return (
            <div style={style.chatBox}>
                <MessageList />
                <MessageForm />
            </div>
        );
    }

}