import React from 'react';

import Chat from '../chat/Chat.jsx';

export default class ChatPage extends React.Component {

    render() {
        return (
            <div className={this.props.className}>
                <Chat />
            </div>
        );
    }

}
