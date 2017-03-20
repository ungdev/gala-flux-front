import React from 'react';

export default class MessageForm extends React.Component {

    constructor() {
        super();

        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    /**
     * Handle key events
     * @param e: the event
     */
    _handleKeyDown(e) {
        if (e.key  === "Enter" && e.target.value) {
            this._sendMessage(e.target.value);
            e.target.value = '';
        }
    }

    /**
     * Send a message
     * @param text: the message to send
     */
    _sendMessage(text) {
        io.socket.post('/testcreate', {text}, function (resData, JWR){
            console.log('Create done: ', resData)
        });
    }

    render() {
        return (
            <div>
                <input
                    type="text"
                    onKeyDown={this._handleKeyDown}
                />
            </div>
        );
    }

}