import React from 'react';

import TeamStore from '../../stores/TeamStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import BarrelChip from '../barrels/partials/BarrelChip.jsx';

export default class StockList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrels: props.barrels,
            selected: props.selected
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barrels: nextProps.barrels,
            selected: nextProps.selected
        });
    }

    render() {
        return (
            <div>
                {
                    Object.keys(this.state.barrels).map(location => {
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
                                            Object.keys(this.state.barrels[location]).map(typeId => {
                                                let type = BarrelTypeStore.findById(typeId);
                                                return  <div key={typeId} className="BarrelChipContainer">
                                                            {
                                                                this.state.barrels[location][typeId].map(barrel => {
                                                                    return  <BarrelChip
                                                                                onSelection={this.props.handleBarrelSelection}
                                                                                key={barrel.id}
                                                                                type={type}
                                                                                barrel={barrel}
                                                                                selectable={true}
                                                                                selected={this.state.selected.includes(barrel)}
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
