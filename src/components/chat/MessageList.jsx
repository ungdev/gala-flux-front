import React from 'react';

import Message from './Message.jsx';

export default class MessageList extends React.Component {

    constructor() {
        super();

        this.state = {
            messages: []
        };
    }

    componentDidMount() {
        // get the messages
        io.socket.get('/message', (body, JWR) => {
            console.log('Sails responded with: ', body);
            console.log('with headers: ', JWR.headers);
            console.log('and with status code: ', JWR.statusCode);
            this.setState({messages: body});
        });
        // listen to the new messages
        io.socket.on('message', event => {
            console.log('DB Message event: ', event);
            // handle the new message
            const state = this.state;
            state.messages.push(event.data);
            this.setState(state);
        });
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