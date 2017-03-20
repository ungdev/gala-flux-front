import React from 'react';

import Message from './Message.jsx';

export default class MessageList extends React.Component {

    constructor() {
        super();

        this.state = {
            messages: [
                "message 1",
                "message 2",
                "message 3"
            ]
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