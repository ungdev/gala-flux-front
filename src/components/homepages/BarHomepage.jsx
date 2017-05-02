import React from 'react';

import AuthStore from '../../stores/AuthStore';
import ChatStore from '../../stores/ChatStore';

import ChatMessageList from '../chat/ChatMessageList.jsx';
import ChatMessageForm from '../chat/ChatMessageForm.jsx';
import BarBarrels from '../barrels/BarBarrels.jsx';
import BarAlertButtons  from '../alertButtons/BarAlertButtons.jsx';

require('../../styles/homepages/BarHomepage.scss');
require('../../styles/FlashScreen.scss');

/**
 * @param {Object} route Route object given by the router
 */
export default class BarHomepage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: props.route,
            flashScreen: false
        };

        // binding
        this._hideFlashScreen = this._hideFlashScreen.bind(this);
        this._flashScreen = this._flashScreen.bind(this);
    }

    componentDidMount() {
        // Listen new messages events
        ChatStore.addNewListener(this._flashScreen);
    }

    componentWillUnmount() {
        // remove the store listener
        ChatStore.removeNewListener(this._flashScreen);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            route: nextProps.route
        });
    }

    _hideFlashScreen() {
        if (this.state.flashScreen) {
            this.setState({ flashScreen: false });
        }
    }

    _flashScreen() {
        // show the flash screen only if the user want it
        if (AuthStore.notifications.flash) {
            this.setState({ flashScreen: true });
        }
    }

    render() {
        let name = 'chat';
        if(this.state.route.name === 'stock' || this.state.route.name === 'alert') {
            name = this.state.route.name;
        }

        return (
            <div className="BarHomePage" onClick={this._hideFlashScreen}>
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
                    this.state.flashScreen &&
                    <div className="flash_screen"></div>
                }
            </div>
        );
    }
}
