import React from 'react';

import TeamStore from 'stores/TeamStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import BottleTypeStore from 'stores/BottleTypeStore';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import BarrelChip from 'components/barrels/partials/BarrelChip.jsx';
import BottleChip from 'components/bottles/partials/BottleChip.jsx';

export default class StockList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            selectedBarrels: props.selectedBarrels,
            selectedBottles: props.selectedBottles,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
            selectedBarrels: nextProps.selectedBarrels,
            selectedBottles: nextProps.selectedBottles,
        });
    }

    render() {
        return (
            <div>
                {
                    Object.keys(this.state.data)
                    .sort((a,b) => {
                        a = TeamStore.findById(a);
                        a = a ? a.name : '';
                        b = TeamStore.findById(b);
                        b = b ? b.name : '';
                        return a.localeCompare(b)
                    })
                    .map(location => {
                        let team = TeamStore.findById(location);
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
                                            Object.keys(this.state.data[location].bottles).map(typeId => {
                                                let type = BottleTypeStore.findById(typeId);
                                                return  <div key={typeId} className="BarrelChipContainer">
                                                        {
                                                            Object.keys(this.state.data[location].bottles[typeId]).map((state, i) => {
                                                                return  <BottleChip
                                                                    key={i}
                                                                    count={this.state.data[location].bottles[typeId][state]}
                                                                    state={state}
                                                                    type={type}
                                                                    team={TeamStore.findById(location)}
                                                                    onSelection={this.props.handleBottleSelection}
                                                                    selectable={state != 'empty'}
                                                                    selected={this.state.selectedBottles && this.state.selectedBottles[location] && this.state.selectedBottles[location][typeId]}
                                                                />
                                                            })
                                                        }
                                                    </div>
                                            })
                                        }
                                        {
                                            Object.keys(this.state.data[location].barrels).map(typeId => {
                                                let type = BarrelTypeStore.findById(typeId);
                                                return  <div key={typeId} className="BarrelChipContainer">
                                                            {
                                                                this.state.data[location].barrels[typeId].map(barrel => {
                                                                    return  <BarrelChip
                                                                                onSelection={this.props.handleBarrelSelection}
                                                                                key={barrel.id}
                                                                                type={type}
                                                                                barrel={barrel}
                                                                                selectable={barrel.state != 'empty'}
                                                                                selected={this.state.selectedBarrels.includes(barrel)}
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
