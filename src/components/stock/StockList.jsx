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
        const styles = {
            barrelChip: {
                display: "inline-block"
            },
            barrelChipContainer: {
                marginBottom: 30
            },
            cardHeader: {
                fontWeight: "bold",
                fontSize: 18
            },
            card: {
                marginTop: 15
            }
        };

        return (
            <div>
                {
                    Object.keys(this.state.barrels).map(location => {
                        let team = TeamStore.findById(location);
                        return  <Card style={styles.card} key={location}>
                                    <CardHeader
                                        title={team ? team.name : "Reserve"}
                                        titleStyle={styles.cardHeader}
                                    />
                                    <CardText>
                                        {
                                            Object.keys(this.state.barrels[location]).map(typeId => {
                                                let type = BarrelTypeStore.findById(typeId);
                                                return  <div key={typeId} style={styles.barrelChipContainer}>
                                                            <div className="BarrelChipContainer">
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