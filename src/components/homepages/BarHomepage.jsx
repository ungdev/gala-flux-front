import React from 'react';

import ChatStore from '../../stores/ChatStore';

import FluxNotification from '../partials/FluxNotification.jsx';
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
            notify: null
        };

        // binding
        this._showNotification = this._showNotification.bind(this);
        this._hideNotification = this._hideNotification.bind(this)
    }

    componentDidMount() {
        // Listen new messages events
        ChatStore.addNewListener(_ => this._showNotification("Vous avez reçu un message !"));
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
            this.setState({ notify: message });
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
                    <FluxNotification message={this.state.notify} />
                }
            </div>
        );
    }
}
