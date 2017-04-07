import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import TypesList from '../barrelTypes/TypesList.jsx';
import BarrelsList from '../barrels/BarrelsList.jsx';

export default class BarrelsPage extends React.Component {

    render() {
        return (
            <Row className="hideContainer">
                <Col xs={12} sm={6} className="hideContainer">
                    <h2>Types de fût</h2>
                    <TypesList />
                </Col>
                <Col xs={12} sm={6} style={{overflow: "scroll"}} className="hideContainer">
                    <h2>Liste des fûts</h2>
                    <BarrelsList />
                </Col>
            </Row>
        );
    }

}