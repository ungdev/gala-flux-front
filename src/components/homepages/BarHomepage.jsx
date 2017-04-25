import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import Chat from '../chat/Chat.jsx';
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
                    <Chat />
                </Col>
            </Row>
        );
    }
}
