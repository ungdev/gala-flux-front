import React from 'react';

import AuthStore from '../../stores/AuthStore';
import ChatStore from '../../stores/ChatStore';

import Notification from '../partials/Notification.jsx';
import ChatMessageList from '../chat/ChatMessageList.jsx';
import ChatMessageForm from '../chat/ChatMessageForm.jsx';
import BarBarrels from '../barrels/BarBarrels.jsx';
import BarAlertButtons  from '../alertButtons/BarAlertButtons.jsx';

require('../../styles/homepages/BarHomepage.scss');

/**
 * @param {Object} route Route object given by the router
 */
export default class BarHomepage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: props.route,
            notify: false
        };

        // binding
        this._showNotification = this._showNotification.bind(this);
        this._hideNotification = this._hideNotification.bind(this)
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

    _showNotification() {
        if (!this.state.notify) {
            this.setState({ notify: true });
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
            <div className="BarHomePage" onClick={this._hideNotification}>
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
                {
                    this.state.notify &&
                    <Notification />
                }
            </div>
        );
    }
}
