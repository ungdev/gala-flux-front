import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import BarrelChip from 'components/barrels/partials/BarrelChip.jsx';
import BottleChip from 'components/bottles/partials/BottleChip.jsx';

/**
 * @param {ModelCollection} teams
 * @param {ModelCollection} barrelTypes
 * @param {ModelCollection} bottleTypes
 * @param {Object} data
 * @param {function} handleBarrelSelection
 * @param {function} handleBottleSelection
 * @param {Object} selectedBarrels
 * @param {Object} selectedBottles
 */
export default class StockList extends React.Component {

    render() {
        return (
            <div>
                {
                    Object.keys(this.props.data)
                    .sort((a,b) => {
                        a = this.props.teams.get(a);
                        a = a ? a.name : '';
                        b = this.props.teams.get(b);
                        b = b ? b.name : '';
                        return a.localeCompare(b)
                    })
                    .map(location => {
                        let team = this.props.teams.get(location);
                        return  <Card className="StockPage__card" key={location}>
                                    <CardHeader
                                        title={team ? team.name : "Reserve"}
                                        subtitle={team ? team.location : "QG Logistique"}
                                        titleStyle={{
                                            fontWeight: "bold",
                                            fontSize: 18,
                                        }}
                                    />
                                    <CardText className="StockPage__card__body">
                                        {
                                            Object.keys(this.props.data[location].bottles).map(typeId => {
                                                let type = this.props.bottleTypes.get(typeId);
                                                return  <div key={typeId} className="BarrelChipContainer">
                                                        {
                                                            Object.keys(this.props.data[location].bottles[typeId]).map((state, i) => {
                                                                return  <BottleChip
                                                                    key={i}
                                                                    count={this.props.data[location].bottles[typeId][state]}
                                                                    state={state}
                                                                    type={type}
                                                                    team={team}
                                                                    onSelection={this.props.handleBottleSelection}
                                                                    selectable={state != 'empty'}
                                                                    selected={this.props.selectedBottles && this.props.selectedBottles[location] && this.props.selectedBottles[location][typeId]}
                                                                />
                                                            })
                                                        }
                                                    </div>
                                            })
                                        }
                                        {
                                            Object.keys(this.props.data[location].barrels).map(typeId => {
                                                let type = this.props.barrelTypes.get(typeId);
                                                return  <div key={typeId} className="BarrelChipContainer">
                                                            {
                                                                this.props.data[location].barrels[typeId].map(barrel => {
                                                                    return  <BarrelChip
                                                                                onSelection={this.props.handleBarrelSelection}
                                                                                key={barrel.id}
                                                                                type={type}
                                                                                barrel={barrel}
                                                                                selectable={barrel.state != 'empty'}
                                                                                selected={this.props.selectedBarrels.includes(barrel.id)}
                                                                            />
                                                                })
                                                            }
                                                        </div>
                                            })
                                        }
                                    </CardText>
                                </Card>

                    })
                }
            </div>
        );
    }

}
