import React from 'react';

import Form from 'app/Chat/components/Form.jsx';
import Messages from 'app/Chat/components/Messages.jsx';
import Channels from 'app/Chat/components/Channels.jsx';

require('./ChatScene.scss');

/**
 * This component will print thet chat page for the admin panel
 * @param {string} channel The channel selected or null
 * @param {bool} hideMenu If true, channel selector will not be shown
 */
export default class ChatScene extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        // let channel = this.state.route.name == 'chat.channel' ? this.state.route.params.channel : false;
        let channel = null;
        return (
            <div className="ChatScene">
                <div className="ChatScene__column">
                    <Messages channel={this.props.channel} />
                    <Form channel={this.props.channel} />
                </div>
                {!this.props.hideMenu &&
                    <Channels channel={this.props.channel} selectDefault={true}/>
                }
            </div>
        );
    }
}
