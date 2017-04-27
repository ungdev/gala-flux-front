import React from 'react';

import ChatMessageList from '../chat/ChatMessageList.jsx';
import ChatMessageForm from '../chat/ChatMessageForm.jsx';
import { Row, Col } from 'react-flexbox-grid';
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
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            route: nextProps.route,
        });
    }

    render() {
        let name = 'chat';
        if(this.state.route.name == 'stock' || this.state.route.name == 'alert') {
            name = this.state.route.name;
        }

        return (
            <div className="BarHomePage">
                <div className={('BarHomePage__alerts ' + (name != 'alert' ? 'BarHomePage__col--secondary':''))}>
                    <BarAlertButtons />
                </div>
                <div className={('BarHomePage__stock ' + (name != 'stock' ? 'BarHomePage__col--secondary':''))}>
                    <BarBarrels />
                </div>
                <div className={('BarHomePage__chat ' + (name != 'chat' ? 'BarHomePage__col--secondary':''))}>
                    <ChatMessageList channel={null}/>
                    <ChatMessageForm channel={null}/>
                </div>
            </div>
        );
    }
}
