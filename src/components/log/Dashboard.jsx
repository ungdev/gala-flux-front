import React from 'react';

import Chat from '../chat/Chat.jsx';
import Alerts from './Alerts.jsx';
require('../../styles/log/Dashboard.scss');

export default class Dashboard extends React.Component {

    render() {
        return (
            <div className="dashboard">
                <Alerts />
                <Chat />
            </div>
        );
    }
}
