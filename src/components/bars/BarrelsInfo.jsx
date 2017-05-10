import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import Euro from 'material-ui/svg-icons/action/euro-symbol';
import BarrelsInfoItem from 'components/bars/BarrelsInfoItem.jsx';

import * as color from 'material-ui/styles/colors';

export default class BarrelsInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrels: props.barrels
        };

        this.states = {
            "new": color.teal600,
            "opened": color.orange600,
            "empty": color.red600,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barrels: nextProps.barrels
        });
    }

    render() {
        let states = Object.keys(this.states);
        let emptyCounter = 0;

        return (
            <div className="CardInfo_container">
                {
                    this.state.barrels &&
                    <div>
                        <div className="CardInfo_title">Fûts :</div>
                        <Row>
                            {
                                states.map((state, i) => {
                                    if (this.state.barrels[state] && this.state.barrels[state].length > 0) {
                                        return <BarrelsInfoItem
                                            key={i}
                                            color={this.states[state]}
                                            number={this.state.barrels[state].length}
                                        />
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
                        <Row className="Barrels_profitability">
                            <Col xs={6} className="CardInfo CardInfo_bordered">
                                <div>
                                    <Euro color={color.red600} />
                                    <span>{Math.round(this.state.barrels.cost)}</span>
                                </div>
                            </Col>
                            <Col xs={6} className="CardInfo CardInfo_bordered">
                                <div>
                                    <Euro color={color.teal600} />
                                    <span>{Math.round(this.state.barrels.profitability)}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }

}
