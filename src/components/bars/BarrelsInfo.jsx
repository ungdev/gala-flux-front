import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import Euro from 'material-ui/svg-icons/action/euro-symbol';
import BarrelsInfoItem from 'components/bars/BarrelsInfoItem.jsx';
import ReactTooltip from 'react-tooltip';

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
                            <Col xs={4 + (this.props.buckless > 0 ? 0 : 2)} className="CardInfo CardInfo_bordered">
                                <div
                                  data-tip
                                  data-for="tip-cost"
                                >
                                    <Euro color={color.red600} />
                                    <span>{Math.round(this.state.barrels.cost)}</span>
                                </div>
                                <ReactTooltip
                                  id="tip-cost"
                                  place="bottom"
                                >
                                  <span style={{whiteSpace: 'pre-line'}} className="bite">
                                      Coût total
                                  </span>
                                </ReactTooltip>
                            </Col>
                            {this.props.buckless > 0 && <Col xs={this.props.buckless > 0 ? 4 : 0} className="CardInfo CardInfo_bordered">
                              <div
                                data-tip
                                data-for="tip-buckless"
                              >
                                  <Euro color={color.orange600} />
                                  <span>{Math.round(this.props.buckless/100)}</span>
                              </div>
                              <ReactTooltip
                                id="tip-buckless"
                                place="bottom"
                              >
                                <span style={{whiteSpace: 'pre-line'}} className="bite">
                                    Vente total sur buckless (attention, cela inclut toutes les ventes !)
                                </span>
                              </ReactTooltip>
                            </Col>}
                            <Col xs={4 + (this.props.buckless > 0 ? 0 : 2)} className="CardInfo CardInfo_bordered">
                                <div
                                  data-tip
                                  data-for="tip-profitability"
                                >
                                    <Euro color={color.teal600} />
                                    <span>{Math.round(this.state.barrels.profitability)}</span>
                                </div>
                                <ReactTooltip
                                    id="tip-profitability"
                                    place="bottom"
                                  >
                                  <span style={{whiteSpace: 'pre-line'}} className="bite">
                                      Vente théorique
                                  </span>
                                </ReactTooltip>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }

}
