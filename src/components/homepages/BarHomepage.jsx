import React from 'react';

import UserStore from 'stores/UserStore';
import TeamStore from 'stores/TeamStore';
import AuthStore from 'stores/AuthStore';

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
        };

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            route: nextProps.route
        });
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
                        <BarAlertButtons team={AuthStore.team} />
                    </div>
                    <div className={('BarHomePage__stock ' + (name !== 'stock' ? 'BarHomePage__col--secondary':''))}>
                        <BarBarrels team={AuthStore.team} />
                    </div>
                    <div className={('BarHomePage__chat ' + (name !== 'chat' ? 'BarHomePage__col--secondary':''))}>
                        <ChatMessageList channel={null}/>
                        <ChatMessageForm channel={null}/>
                    </div>
                </div>
            </div>
        );
    }
}
