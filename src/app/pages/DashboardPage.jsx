import React from 'react';

import ChatScene from 'app/Chat/ChatScene.jsx';
import AlertScene from 'app/Alerts/AlertScene.jsx';

require('./pages.scss');

export default class DashboardPage extends React.Component {
    render() {
        let channel = null;
        // Set channel if we are on chat path
        if(this.props.router.routes.map(route => route.path).includes('/chat/**') && this.props.router.params.splat) {
            channel = this.props.router.params.splat;
        }

        return (
            <div className="pages__VerticalSplitLayout">
                <div className={!this.props.router.isActive('/alerts') ? 'pages__VerticalSplitLayout__secondary' : ''}>
                    <AlertScene />
                </div>
                <div className={this.props.router.isActive('/alerts') ? 'pages__VerticalSplitLayout__secondary' : ''}>
                    <ChatScene channel={channel} />
                </div>
            </div>
        );
    }
}
