import React from 'react';
import { Grid, Col } from 'react-flexbox-grid';

require('../../styles/log/Alert.scss');

export default class Alert extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Col xs={12} sm={6} md={6} lg={6} className="alert">
                <div className="alert__container">
                    <div className="alert__team-name__container">
                        <div className="alert__team-name">
                            TEAM PROPROPRO
                        </div>
                    </div>
                    <div className="alert__content">
                        <span className="alert__title">
                            <p>
                            Ceci est le titre de l'alerte qui indique entre autres son type
                            </p>
                        </span>
                        <span className="alert__description">
                            <p>
                                Premières lignes de la description. Ceci est une description. Elle sera coupée sur l'alerte et lisible entièrement au survol.
                            </p>
                        </span>
                    </div>
                    <div className="alert__action">
                    </div>
                </div>
            </Col>
        );
    }
}
