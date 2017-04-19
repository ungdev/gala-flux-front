import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import Barrel from 'material-ui/svg-icons/device/battery-full';
import Euro from 'material-ui/svg-icons/action/euro-symbol';

import * as color from 'material-ui/styles/colors';

export default class BarrelsInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="CardInfo_container">
                {
                    this.props.barrels &&
                    <div>
                        <div className="CardInfo_title">Fûts :</div>
                        <Row>
                            <Col xs={4} className="CardInfo">
                                <Barrel color={color.teal600} />
                                <span>{this.props.barrels["new"].length}</span>
                            </Col>
                            <Col xs={4} className="CardInfo">
                                <Barrel color={color.orange600} />
                                <span>{this.props.barrels["opened"].length}</span>
                            </Col>
                            <Col xs={4} className="CardInfo">
                                <Barrel color={color.red600} />
                                <span>{this.props.barrels["empty"].length}</span>
                            </Col>
                        </Row>
                        <Row className="Barrels_profitability">
                            <Col xs={6} className="CardInfo CardInfo_bordered">
                                <div>
                                    <Euro color={color.red600} />
                                    <span>{Math.round(this.props.barrels.cost)}</span>
                                </div>
                            </Col>
                            <Col xs={6} className="CardInfo CardInfo_bordered">
                                <div>
                                    <Euro color={color.teal600} />
                                    <span>{Math.round(this.props.barrels.profitability)}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }

}