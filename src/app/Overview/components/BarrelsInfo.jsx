import React from 'react';

import Grid from 'material-ui/Grid';
import Euro from 'material-ui-icons/EuroSymbol';
import Barrel from 'material-ui-icons/BatteryFull';

import { teal, orange, red } from 'material-ui/colors';

/**
 * @param {Object} prices
 * @param {Object} barrelList
 * @param {Object} barrelCount
 */
export default class BarrelsInfo extends React.Component {

    constructor(props) {
        super(props);

        this.states = {
            "new": teal[600],
            "opened": orange[600],
            "empty": red[600],
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
                        <Grid container spacing={24}>
                            {
                                states.map((state) => {
                                    if (this.props.barrelCount[state] && this.props.barrelCount[state] > 0) {
                                        return <Grid item xs={4} className="Overview__CardInfo" key={state}>
                                                <Barrel color={this.states[state]} />
                                                <span>{this.props.barrelCount[state]}</span>
                                            </Grid>
                                    } else {
                                        emptyCounter++;
                                    }
                                })
                            }
                        </Grid>
                        {
                            emptyCounter === states.length &&
                            <div style={{textAlign: "center"}}>
                                Aucun fût
                            </div>
                        }
                        { Object.keys(this.props.prices).length != 0 &&
                        <Grid container spacing={8} className="Overview__CardInfo__profitability">
                            <Grid item xs={6} className="Overview__CardInfo Overview__CardInfo--bordered">
                                <div>
                                    <span>{Math.round(this.props.prices.supplierPrice)}</span>
                                    <Euro color={red[600]} />
                                </div>
                            </Grid>
                            <Grid item xs={6} className="Overview__CardInfo Overview__CardInfo--bordered">
                                <div>
                                    <span>{Math.round(this.props.prices.sellPrice)}</span>
                                    <Euro color={teal[600]} />
                                </div>
                            </Grid>
                        </Grid>
                        }
                    </div>
                }
            </div>
        );
    }

}
