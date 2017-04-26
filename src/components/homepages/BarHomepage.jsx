import React from 'react';

import ChatMessageList from '../chat/ChatMessageList.jsx';
import ChatMessageForm from '../chat/ChatMessageForm.jsx';
import BarBarrels from '../barrels/BarBarrels.jsx';

export default class BarHomepage extends React.Component {

    render() {
        return (
            <div>
                <BarBarrels />

                <div className="Chat">
                    <div className="Chat__column">
                        <ChatMessageList channel={null}/>
                        <ChatMessageForm channel={null}/>
                    </div>
                </div>
            </div>
        );
    }
}
