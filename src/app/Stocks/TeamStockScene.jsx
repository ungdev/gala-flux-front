import React from 'react';

import BarrelService from 'services/BarrelService';
import BarrelStore from 'stores/BarrelStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import BottleActionStore from 'stores/BottleActionStore';
import BottleTypeStore from 'stores/BottleTypeStore';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';

import { Row, Col } from 'react-flexbox-grid';
import BottleChip from 'app/Stocks/Bottles/components/BottleChip.jsx';
import UpdateBottleDialog from 'app/Stocks/Bottles/dialogs/UpdateBottleDialog.jsx';
import BarrelChip from 'app/Stocks/Barrels/components/BarrelChip.jsx';
import DataLoader from 'app/components/DataLoader.jsx';

require('./TeamStockScene.scss');


/**
 * @param {Object} team
 */
export default class TeamStockScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrels: {
                "new": {},
                "opened": {},
                "empty": {}
            },
            bottles: {
                "new": {},
                "empty": {}
            },
            updatedBottle: {type: null, count: 0, state: 'new'},
        };

        this.states = ["new", "opened", "empty"];

        // binding
        this.updateBarrelState = this.updateBarrelState.bind(this);
        this.backPreviousState = this.backPreviousState.bind(this);
        this.moveNextState = this.moveNextState.bind(this);
        this.handleDatastoreChange = this.handleDatastoreChange.bind(this);
    }

    /**
     * Update state when store are updated
     */
    handleDatastoreChange(datastore) {
        let state = {
            barrels: {
                "new": {},
                "opened": {},
                "empty": {}
            },
            bottles: {
                "new": {},
                "empty": {}
            },
            barrelTypes: datastore.BarrelType,
            bottleTypes: datastore.BottleType,
        };

        // Init barrels
        for (let barrel of datastore.Barrel.values()) {
            if(!state.barrels[barrel.state][barrel.typeId]) {
                state.barrels[barrel.state][barrel.typeId] = [];
            }
            state.barrels[barrel.state][barrel.typeId].push(barrel);
        }

        // Init bottles
        let count = BottleActionStore.count[this.props.team.id];
        if(count) {
            for (let typeId in count) {
                for (let bottleState in count[typeId]) {
                    if(count[typeId][bottleState] > 0) {
                        state.bottles[bottleState][typeId] = count[typeId][bottleState];
                    }
                }
            }
        }

        this.setState(state);
    }


    /**
     * If the barrel state is not the last state, call the method
     * to update the state of this barrel with the next state
     *
     * @param {object} barrel: the barrel to update
     */
    moveNextState(barrel) {
        const currentState = this.states.indexOf(barrel.state);
        if (currentState < 2) {
            this.updateBarrelState(barrel, this.states[currentState + 1]);
        }
    }

    /**
     * If the barrel state is not the first state, call the method
     * to update the state of this barrel with the previous state
     *
     * @param {object} barrel: the barrel to update
     */
    backPreviousState(barrel) {
        const currentState = this.states.indexOf(barrel.state);
        if (currentState > 0) {
            this.updateBarrelState(barrel, this.states[currentState - 1]);
        }
    }

    /**
     * Call the BarrelService to update the state of a barrel
     *
     * @param {object} barrel: the barrel to update
     * @param {string} newState: the new barrel state
     */
    updateBarrelState(barrel, newState) {
        BarrelService.update(barrel.id, {state: newState})
        .catch(error => NotificationActions.error("Erreur lors de l'etat des fûts.", error));
    }

    render() {
        return (
            <DataLoader
                filters={new Map([
                    ['Barrel', {teamId: this.props.team.id}],
                    ['BarrelType', (datastore) => ({id: datastore.Barrel.map(barrel => barrel.typeId)}) ],
                    ['BottleAction', [{teamId: this.props.team.id}, {fromTeamId: this.props.team.id}]],
                    ['BottleType', (datastore) => ({id: datastore.BottleAction.map(bottle => bottle.typeId)})],
                ])}
                onChange={ datastore => this.handleDatastoreChange(datastore) }
            >
                { () => (
                    <Row className="TeamStockScene">
                        <Col xs={12} sm={4}>
                            <h3>En stock</h3>
                            <div>
                                {
                                    Object.keys(this.state.barrels.new).length || Object.keys(this.state.bottles.new).length
                                        ?
                                            [Object.keys(this.state.barrels.new).map((typeId, i) => {
                                                let type = this.state.barrelTypes.get(parseInt(typeId));
                                                return <div key={i}>
                                                    <h4>{type ? type.name : ''}</h4>
                                                    <div className="BarrelChipContainer">
                                                    {
                                                        this.state.barrels.new[typeId].map((barrel, i) => {
                                                            return <BarrelChip
                                                                        key={i}
                                                                        barrel={barrel}
                                                                        type={type}
                                                                        onClick={this.moveNextState}
                                                                    />
                                                        })
                                                    }
                                                    </div>
                                                </div>

                                            }),
                                            Object.keys(this.state.bottles.new).map((typeId, i) => {
                                                let type = this.state.bottleTypes.get(parseInt(typeId));
                                                let total = (this.state.bottles.new[typeId] || 0) + (this.state.bottles.empty[typeId] || 0);
                                                return <div key={i}>
                                                    <h4>{type ? type.name : ''}</h4>
                                                    <div className="BarrelChipContainer">
                                                        <BottleChip
                                                            count={this.state.bottles.new[typeId]}
                                                            state="new"
                                                            type={type}
                                                            onClick={() => this.setState({updatedBottle: {type: type, count: this.state.bottles.new[typeId], state: 'new', total: total}})}
                                                        />
                                                    </div>
                                                </div>

                                            })]

                                        :
                                            <small>Aucun item en stock.</small>
                                }
                            </div>
                        </Col>
                        <Col xs={12} sm={4}>
                            <h3>Entamé</h3>
                            <div>
                                {
                                    Object.keys(this.state.barrels.opened).length
                                        ?
                                            Object.keys(this.state.barrels.opened).map((typeId, i) => {
                                                let type = this.state.barrelTypes.get(parseInt(typeId));
                                                return <div key={i}>
                                                    <h4>{type ? type.name : ''}</h4>
                                                    <div className="BarrelChipContainer">
                                                    {
                                                        this.state.barrels.opened[typeId].map((barrel, i) => {
                                                            return <BarrelChip
                                                                        key={i}
                                                                        barrel={barrel}
                                                                        type={type}
                                                                        onClick={this.moveNextState}
                                                                        onRequestDelete={this.backPreviousState}
                                                                    />
                                                        })
                                                    }
                                                    </div>
                                                </div>

                                            })

                                        :
                                        <small>Aucun item ouvert.</small>
                                }
                            </div>
                        </Col>
                        <Col xs={12} sm={4}>
                            <h3>Terminé</h3>
                            <div>
                                {
                                    Object.keys(this.state.barrels.empty).length || Object.keys(this.state.bottles.empty).length
                                        ?
                                            [Object.keys(this.state.barrels.empty).map((typeId, i) => {
                                                let type = this.state.barrelTypes.get(parseInt(typeId));
                                                return <div key={i}>
                                                    <h4>{type ? type.name : ''}</h4>
                                                    <div className="BarrelChipContainer">
                                                    {
                                                        this.state.barrels.empty[typeId].map((barrel, i) => {
                                                            return <BarrelChip
                                                                        key={i}
                                                                        barrel={barrel}
                                                                        type={type}
                                                                        onRequestDelete={this.backPreviousState}
                                                                    />
                                                        })
                                                    }
                                                    </div>
                                                </div>

                                            }),
                                            Object.keys(this.state.bottles.empty).map((typeId, i) => {
                                                let type = this.state.bottleTypes.get(parseInt(typeId));
                                                let total = (this.state.bottles.new[typeId] || 0) + (this.state.bottles.empty[typeId] || 0);
                                                return <div key={i}>
                                                    <h4>{type ? type.name : ''}</h4>
                                                    <div className="BarrelChipContainer">
                                                        <BottleChip
                                                            count={this.state.bottles.empty[typeId]}
                                                            state="empty"
                                                            type={type}
                                                            onRequestDelete={() => this.setState({updatedBottle: {type: type, count: this.state.bottles.new[typeId], state: 'empty', total: total}})}
                                                        />
                                                    </div>
                                                </div>

                                            })]

                                        :
                                        <small>Aucun item terminé.</small>
                                }
                            </div>
                        </Col>
                        { this.state.updatedBottle.type &&
                            <UpdateBottleDialog
                                type={this.state.updatedBottle.type}
                                count={this.state.updatedBottle.count}
                                total={this.state.updatedBottle.total}
                                team={this.props.team}
                                state={this.state.updatedBottle.state}
                                show={this.state.updatedBottle.type != null}
                                close={() => this.setState({updatedBottle: {type: null, count: 0, state: 'new'}})}
                            />
                        }
                    </Row>
                )}
            </DataLoader>
        );
    }

}
