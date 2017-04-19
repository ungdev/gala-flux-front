import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import Chat from '../chat/Chat.jsx';
import BarBarrels from '../barrels/BarBarrels.jsx';
import BarAlertButtons  from '../alertButtons/BarAlertButtons.jsx';

export default class BarHomepage extends React.Component {

    render() {
        return (
            <div>
                <Row>
                    <Col xs={12} sm={3}>
                        <BarAlertButtons />
                    </Col>
                    <Col xs={12} sm={6}>
                        <BarBarrels />
                    </Col>
                    <Col xs={12} sm={3}>
                        <Chat />
                    </Col>
                </Row>
            </div>
        );
    }
}
