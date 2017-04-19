import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import Warning from 'material-ui/svg-icons/alert/warning';

import * as color from 'material-ui/styles/colors';

export default class AlertsInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="CardInfo_container">
                {
                    this.props.alerts &&
                    <div>
                        <div className="CardInfo_title">Alertes :</div>
                        <Row>
                            <Col xs={4} className="CardInfo">
                                <Warning color={color.teal600} />
                                <span>{this.props.alerts["done"].length}</span>
                            </Col>
                            <Col xs={4} className="CardInfo">
                                <Warning color={color.orange600} />
                                <span>{this.props.alerts["warning"].length}</span>
                            </Col>
                            <Col xs={4} className="CardInfo">
                                <Warning color={color.red600} />
                                <span>{this.props.alerts["serious"].length}</span>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }

}