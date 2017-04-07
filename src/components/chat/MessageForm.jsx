import React from 'react';

import ChatService from '../../services/ChatService';

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
            ChatService.sendMessage(e.target.value, err => {
                console.log("post message error : ", err);
            });
            e.target.value = '';
        }
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
