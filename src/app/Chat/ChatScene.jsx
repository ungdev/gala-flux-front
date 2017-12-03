import React from 'react';

import Form from 'app/Chat/components/Form.jsx';
import Messages from 'app/Chat/components/Messages.jsx';
import ChannelList from 'app/Chat/components/ChannelList.jsx';
import MenuContainer from 'app/Layout/components/MenuContainer.jsx';

require('./ChatScene.scss');

/**
 * This component will print thet chat page for the admin panel
 * @param {string} channel The channel selected or null
 * @param {bool} hideMenu If true, channel selector will not be shown
 * @param {Object} router react-router router object
 */
export default class ChatScene extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let channel = null;
        // Set channel if we are on chat path
        if(this.props.router && this.props.router.routes.map(route => route.path).includes('/chat/**') && this.props.router.params.splat) {
            channel = this.props.router.params.splat;
        }

        return (
            <div className="ChatScene">
                <div className="ChatScene__column">
                    <Messages channel={this.props.channel} />
                    <Form channel={this.props.channel} />
                </div>
                {!this.props.hideMenu &&
                    <MenuContainer router={this.props.router}>
                        <ChannelList selectDefault={true}/>
                    </MenuContainer>
                }
            </div>
        );
    }
}
