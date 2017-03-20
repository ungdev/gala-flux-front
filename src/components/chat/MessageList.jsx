import React from 'react';

import Message from './Message.jsx';

export default class MessageList extends React.Component {

    constructor() {
        super();

        this.state = {
            messages: []
        };

        this._handleMessage = this._handleMessage.bind(this);
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
        io.socket.on('message', this._handleMessage);
    }

    componentWillUnmount() {
        // remove the socket io listener
        io.socket.off('message', this._handleMessage);
    }

    _handleMessage(e) {
        console.log('DB Message event: ', e);
        // handle the new message
        const state = this.state;
        state.messages.push(e.data);
        this.setState(state);
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