import React from 'react';

import ChatMessageForm from '../chat/ChatMessageForm.jsx';
import ChatMessageList from '../chat/ChatMessageList.jsx';
import ChatMenu from '../chat/ChatMenu.jsx';

require('../../styles/chat/ChatPage.scss');

/**
 * This component will print thet chat page for the admin panel
 * @param {object} route The route state
 */
export default class ChatPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: props.route,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            route: nextProps.route,
        });
    }

    render() {
        let channel = this.state.route.name == 'chat.channel' ? this.state.route.params.channel : false;

        return (
            <div className={this.props.className}>
                <div className="ChatPage">
                    <div className="ChatPage__column">
                        <ChatMessageList channel={channel} />
                        <ChatMessageForm channel={channel} />
                    </div>
                    <ChatMenu route={this.state.route} selectDefault={true}/>
                </div>
            </div>
        );
    }
}
