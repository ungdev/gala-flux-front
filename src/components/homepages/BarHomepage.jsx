import React from 'react';

import ChatPage from '../adminPages/ChatPage.jsx';
import BarBarrels from '../barrels/BarBarrels.jsx';

export default class BarHomepage extends React.Component {

    render() {
        return (
            <div>
                <BarBarrels />
                <ChatPage />
            </div>
        );
    }
}
