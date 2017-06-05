import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import Euro from 'material-ui/svg-icons/action/euro-symbol';
import Barrel from 'material-ui/svg-icons/device/battery-full';

import * as color from 'material-ui/styles/colors';

/**
 * @param {Object} prices
 * @param {Object} barrelList
 * @param {Object} barrelCount
 */
export default class BarrelsInfo extends React.Component {

    constructor(props) {
        super(props);

        this.states = {
            "new": color.teal600,
            "opened": color.orange600,
            "empty": color.red600,
        }
    }

    render() {
        let states = Object.keys(this.states);
        let emptyCounter = 0;

        return (
            <div className="Overview__CardInfo__container">
                {
                    <div>
                        <div className="Overview__CardInfo__title">Fûts :</div>
                        <Row>
                            {
                                states.map((state, i) => {
                                    if (this.props.barrelCount[state] && this.props.barrelCount[state] > 0) {
                                        return <Col xs={4} className="Overview__CardInfo" key={i}>
                                                <Barrel color={this.states[state]} />
                                                <span>{this.props.barrelCount[state]}</span>
                                            </Col>
                                    } else {
                                        emptyCounter++;
                                    }
                                })
                            }
                        </Row>
                        {
                            emptyCounter === states.length &&
                            <div style={{textAlign: "center"}}>
                                Aucun fût
                            </div>
                        }
                        <Row className="Overview__CardInfo__profitability">
                            <Col xs={6} className="Overview__CardInfo Overview__CardInfo--bordered">
                                <div>
                                    <span>{Math.round(this.props.prices.supplierPrice)}</span>
                                    <Euro color={color.red600} />
                                </div>
                            </Col>
                            <Col xs={6} className="Overview__CardInfo Overview__CardInfo--bordered">
                                <div>
                                    <span>{Math.round(this.props.prices.sellPrice)}</span>
                                    <Euro color={color.teal600} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }

}
