import React from 'react';

import BarrelService from 'services/BarrelService';
import BarrelStore from 'stores/BarrelStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import BottleActionStore from 'stores/BottleActionStore';
import BottleTypeStore from 'stores/BottleTypeStore';
import TeamStore from 'stores/TeamStore';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';

import { Row, Col } from 'react-flexbox-grid';
import BottleChip from 'components/bottles/partials/BottleChip.jsx';
import UpdateBottleDialog from 'components/bottles/dialogs/UpdateBottleDialog.jsx';
import BarrelChip from 'components/barrels/partials/BarrelChip.jsx';

require('styles/barrels/BarBarrels.scss');

export default class BarBarrels extends React.Component {

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
            barId: props.barId
        };

        this.BarrelStoreToken = null;
        this.BarrelTypeStoreToken = null;
        this.TeamStoreToken = null;
        this.BottleActionStoreToken = null;
        this.BottleTypeStoreToken = null;

        this.states = ["new", "opened", "empty"];

        // binding
        this._loadData = this._loadData.bind(this);
        this._unloadData = this._unloadData.bind(this);
        this._updateData = this._updateData.bind(this);

        this._updateBarrelState = this._updateBarrelState.bind(this);
        this._backPreviousState = this._backPreviousState.bind(this);
        this._moveNextState = this._moveNextState.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barId: nextProps.barId
        }, _ => {
            this._updateData();
        });
    }

    componentDidMount() {
        // Load data from the store
        this._loadData()
        .then(_ => {
            // listen the stores changes
            BarrelStore.addChangeListener(this._updateData);
            BarrelTypeStore.addChangeListener(this._updateData);
            TeamStore.addChangeListener(this._updateData);
            BottleActionStore.addChangeListener(this._updateData);
            BottleTypeStore.addChangeListener(this._updateData);
        });
    }

    componentWillUnmount() {
        // clear store
        this._unloadData();

        // remove the stores listeners
        BarrelStore.removeChangeListener(this._updateData);
        BarrelTypeStore.removeChangeListener(this._updateData);
        TeamStore.removeChangeListener(this._updateData);
        BottleActionStore.removeChangeListener(this._updateData);
        BottleTypeStore.removeChangeListener(this._updateData);
    }

    /**
     * Load data from all stores and update state
     */
    _loadData() {
        // fill the stores
        return BarrelStore.loadData(this.state.barId ? null : {teamId: AuthStore.team && AuthStore.team.id})
        .then(data => {
            // ensure that last token doesn't exist anymore.
            BarrelStore.unloadData(this.BarrelStoreToken);
            // save the component token
            this.BarrelStoreToken = data.token;

            return BarrelTypeStore.loadData(null);
        })
        .then(data => {
            // ensure that last token doesn't exist anymore.
            BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);
            // save the component token
            this.BarrelTypeStoreToken = data.token;

            return BottleActionStore.loadCount();
        })
        .then(data => {
            // ensure that last token doesn't exist anymore.
            BottleActionStore.unloadCount(this.BottleActionStoreToken);
            // save the component token
            this.BottleActionStoreToken = data.token;

            return BottleTypeStore.loadData(null);
        })
        .then(data => {
            // ensure that last token doesn't exist anymore.
            BottleTypeStore.unloadData(this.BottleTypeStoreToken);
            // save the component token
            this.BottleTypeStoreToken = data.token;

            return TeamStore.loadData(null);
        })
        .then(data => {
            // ensure that last token doesn't exist anymore.
            TeamStore.unloadData(this.TeamStoreToken);
            // save the component token
            this.TeamStoreToken = data.token;

            // init values
            this._updateData();
        })
        .catch(error => NotificationActions.error("Erreur lors de la récupération des stocks.", error));
    }

    /**
     * clear stores
     */
    _unloadData() {
        BarrelStore.unloadData(this.BarrelStoreToken);
        BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);
        TeamStore.unloadData(this.TeamStoreToken);
        BottleActionStore.unloadCount(this.BottleActionStoreToken);
        BottleTypeStore.unloadData(this.BottleTypeStoreToken);
    }

    /**
     * Update data according to stores without adding new filter to it
     */
    _updateData() {
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
            barId: this.state.barId
        };

        // Init barrels
        for (let barrel of BarrelStore.find({teamId: state.barId ? state.barId : AuthStore.team.id})) {
            if(!state.barrels[barrel.state][barrel.typeId]) {
                state.barrels[barrel.state][barrel.typeId] = [];
            }
            state.barrels[barrel.state][barrel.typeId].push(barrel);
        }

        // Init bottles
        let count = BottleActionStore.count[state.barId ? state.barId : AuthStore.team.id];
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
    _moveNextState(barrel) {
        const currentState = this.states.indexOf(barrel.state);
        if (currentState < 2) {
            this._updateBarrelState(barrel, this.states[currentState + 1]);
        }
    }

    /**
     * If the barrel state is not the first state, call the method
     * to update the state of this barrel with the previous state
     *
     * @param {object} barrel: the barrel to update
     */
    _backPreviousState(barrel) {
        const currentState = this.states.indexOf(barrel.state);
        if (currentState > 0) {
            this._updateBarrelState(barrel, this.states[currentState - 1]);
        }
    }

    /**
     * Call the BarrelService to update the state of a barrel
     *
     * @param {object} barrel: the barrel to update
     * @param {string} newState: the new barrel state
     */
    _updateBarrelState(barrel, newState) {
        BarrelService.update(barrel.id, {state: newState})
        .catch(error => NotificationActions.error("Erreur lors de l'etat des fûts.", error));
    }

    render() {
        return (
            <Row className="BarBarrels">
                <Col xs={12} sm={4}>
                    <h3>En stock</h3>
                    <div>
                        {
                            Object.keys(this.state.barrels.new).length || Object.keys(this.state.bottles.new).length
                                ?
                                    [Object.keys(this.state.barrels.new).map((typeId, i) => {
                                        let type = BarrelTypeStore.findById(typeId);
                                        return <div key={i}>
                                            <h4>{type ? type.name : ''}</h4>
                                            <div className="BarrelChipContainer">
                                            {
                                                this.state.barrels.new[typeId].map((barrel, i) => {
                                                    return <BarrelChip
                                                                key={i}
                                                                barrel={barrel}
                                                                type={type}
                                                                onClick={this._moveNextState}
                                                            />
                                                })
                                            }
                                            </div>
                                        </div>

                                    }),
                                    Object.keys(this.state.bottles.new).map((typeId, i) => {
                                        let type = BottleTypeStore.findById(typeId);
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
                                        let type = BarrelTypeStore.findById(typeId);
                                        return <div key={i}>
                                            <h4>{type ? type.name : ''}</h4>
                                            <div className="BarrelChipContainer">
                                            {
                                                this.state.barrels.opened[typeId].map((barrel, i) => {
                                                    return <BarrelChip
                                                                key={i}
                                                                barrel={barrel}
                                                                type={type}
                                                                onClick={this._moveNextState}
                                                                onRequestDelete={this._backPreviousState}
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
                                        let type = BarrelTypeStore.findById(typeId);
                                        return <div key={i}>
                                            <h4>{type ? type.name : ''}</h4>
                                            <div className="BarrelChipContainer">
                                            {
                                                this.state.barrels.empty[typeId].map((barrel, i) => {
                                                    return <BarrelChip
                                                                key={i}
                                                                barrel={barrel}
                                                                type={type}
                                                                onRequestDelete={this._backPreviousState}
                                                            />
                                                })
                                            }
                                            </div>
                                        </div>

                                    }),
                                    Object.keys(this.state.bottles.empty).map((typeId, i) => {
                                        let type = BottleTypeStore.findById(typeId);
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
                        team={AuthStore.team}
                        state={this.state.updatedBottle.state}
                        show={this.state.updatedBottle.type != null}
                        close={() => this.setState({updatedBottle: {type: null, count: 0, state: 'new'}})}
                    />
                }
            </Row>
        );
    }

}
