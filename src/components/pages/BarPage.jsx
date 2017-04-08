import React from 'react';

import Chat from '../chat/Chat.jsx';
import BarBarrels from '../barrels/BarBarrels.jsx';

export default class BarPage extends React.Component {

    render() {
        return (
            <div>
                <BarBarrels />
                <Chat />
            </div>
        );
    }

}