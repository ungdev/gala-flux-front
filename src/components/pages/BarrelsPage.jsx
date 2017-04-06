import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import TypesList from '../barrelTypes/TypesList.jsx';

export default class BarrelsPage extends React.Component {

    render() {
        return (
            <Row className="hideContainer">
                <Col xs={12} sm={6} className="hideContainer">
                    <TypesList />
                </Col>
                <Col xs={12} sm={6} className="hideContainer">
                    FUUUUTS
                </Col>
            </Row>
        );
    }

}