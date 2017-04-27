import React from 'react';

import ChatMessageList from '../chat/ChatMessageList.jsx';
import ChatMessageForm from '../chat/ChatMessageForm.jsx';
import { Row, Col } from 'react-flexbox-grid';
import BarBarrels from '../barrels/BarBarrels.jsx';
import BarAlertButtons  from '../alertButtons/BarAlertButtons.jsx';

require('../../styles/homepages/BarHomepage.scss');

export default class BarHomepage extends React.Component {

    render() {
        return (
            <Row className="BarHomePage">
                <Col xs={12} sm={3} className="AlertButtons_container BarHomePage_col">
                    <BarAlertButtons />
                </Col>
                <Col xs={12} sm={6} className="BarHomePage_col">
                    <BarBarrels />
                </Col>
                <Col xs={12} sm={3} className="BarHomePage_col">
                    <ChatMessageList channel={null}/>
                    <ChatMessageForm channel={null}/>
                </Col>
            </Row>
        );
    }
}
