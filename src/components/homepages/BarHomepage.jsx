import React from 'react';

import ChatStore from 'stores/ChatStore';
import UserStore from 'stores/UserStore';
import TeamStore from 'stores/TeamStore';

import FluxNotification from 'components/partials/FluxNotification.jsx';
import ChatMessageList from 'components/chat/ChatMessageList.jsx';
import ChatMessageForm from 'components/chat/ChatMessageForm.jsx';
import BarBarrels from 'components/barrels/BarBarrels.jsx';
import BarAlertButtons  from 'components/alertButtons/BarAlertButtons.jsx';

require('styles/homepages/BarHomepage.scss');

/**
 * @param {Object} route Route object given by the router
 */
export default class BarHomepage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: props.route,
            notify: null
        };

        // binding
        this._showNotification = this._showNotification.bind(this);
        this._hideNotification = this._hideNotification.bind(this);
    }

    componentDidMount() {
        // Listen new messages events
        ChatStore.addNewListener(this._showNotification);
    }

    componentWillUnmount() {
        // remove the store listener
        ChatStore.removeNewListener(this._showNotification);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            route: nextProps.route
        });
    }

    _showNotification(message) {
        if (!this.state.notify) {
            let user = UserStore.findById(message.sender);
            let team = user ? TeamStore.findById(user.team) : null;
            let contentPrefix = (user? user.name + (team?' ('+team.name+')':'') + ' : ' : '');
            this.setState({ notify: { title: 'Vous avez reçu un message !', content: contentPrefix + message.text }});
        }
    }

    _hideNotification() {
        if (this.state.notify) {
            this.setState({ notify: false });
        }
    }

    render() {
        let name = 'chat';
        if(this.state.route.name === 'stock' || this.state.route.name === 'alert') {
            name = this.state.route.name;
        }

        return (
            <div onClick={this._hideNotification}>
                <div className="BarHomePage">
                    <div className={('BarHomePage__alerts ' + (name !== 'alert' ? 'BarHomePage__col--secondary':''))}>
                        <BarAlertButtons />
                    </div>
                    <div className={('BarHomePage__stock ' + (name !== 'stock' ? 'BarHomePage__col--secondary':''))}>
                        <BarBarrels />
                    </div>
                    <div className={('BarHomePage__chat ' + (name !== 'chat' ? 'BarHomePage__col--secondary':''))}>
                        <ChatMessageList channel={null}/>
                        <ChatMessageForm channel={null}/>
                    </div>
                </div>
                {
                    this.state.notify &&
                    <FluxNotification title={this.state.title} content={this.state.content} />
                }
            </div>
        );
    }
}
