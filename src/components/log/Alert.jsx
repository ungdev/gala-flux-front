import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

require('../../styles/log/Alert.scss');

export default class Alert extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Col xs={12} sm={6} md={6} lg={6} className="alert">
                <div className="alert__team-name">
                    
                </div>
                <div className="alert__content">
                    Titre de l'alerte
                    <span>Premières lignes de la description</span>
                </div>
                <div className="alert__action">
                </div>
            </Col>
        );
    }
}
