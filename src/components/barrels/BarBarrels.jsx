import React from 'react';

import BarrelService from '../../services/BarrelService';
import BarrelStore from '../../stores/BarrelStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';
import AuthStore from '../../stores/AuthStore';

import Subheader from 'material-ui/Subheader';

import { Row, Col } from 'react-flexbox-grid';
import BarrelChip from './partials/BarrelChip.jsx';

export default class BarBarrels extends React.Component {

    constructor() {
        super();

        this.state = {
            barrels: {
                "new": {},
                "opened": {},
                "empty": {}
            }
        };

        this.BarrelStoreToken = null;
        this.BarrelTypeStoreToken = null;

        this.states = ["new", "opened", "empty"];

        // binding
        this._setBarrels = this._setBarrels.bind(this);
        this._backPreviousState = this._backPreviousState.bind(this);
        this._moveNextState = this._moveNextState.bind(this);
        this._updateBarrelState = this._updateBarrelState.bind(this);
    }

    componentDidMount() {
        // fill the stores
        BarrelStore.loadData(null)
            .then(data => {
                // ensure that last token doen't exist anymore.
                BarrelStore.unloadData(this.BarrelStoreToken);

                // save the component token
                this.BarrelStoreToken = data.token;
                // get distinct barrel types id and create objects with their id
                let types = [...new Set(data.result.map(barrel => barrel.type))];
                for (let i in types) {
                    types[i] = {id: types[i]};
                }
                BarrelTypeStore.loadData(types)
                    .then(data => {
                        // ensure that last token doen't exist anymore.
                        BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);

                        // save the component token
                        this.BarrelTypeStoreToken = data.token;
                    })
                    .catch(error => console.log("bar barrels load types error", error));
            })
            .catch(error => console.log("bar barrels load barrels error", error));

        // listen the stores changes
        BarrelStore.addChangeListener(this._setBarrels);
        BarrelTypeStore.addChangeListener(this._setBarrels);
        // init barrels list and barrelTypes list
        this._setBarrels();
    }

    componentWillUnmount() {
        // clear stores
        BarrelStore.unloadData(this.BarrelStoreToken);
        BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);
        // remove the stores listeners
        BarrelStore.removeChangeListener(this._setBarrels);
        BarrelTypeStore.removeChangeListener(this._setBarrels);
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
        barrel.state = newState;
        BarrelService.update(barrel.id, barrel)
            .catch(error => console.log("update barrel state error", error));
    }

    /**
     * Set the barrels in the store with the barrel of the user's team
     */
    _setBarrels() {
        // if the AuthStore.user attribute is not initialized yet, we don't know the user's team
        if (AuthStore.user && BarrelTypeStore.types) {
            const barrels = {
                "new": {},
                "opened": {},
                "empty": {}
            };
            // put each barrel of the user's team in the matching state indexed by type
            for (let barrel of BarrelStore.find({place: AuthStore.user.team})) {
                if(!barrels[barrel.state][barrel.type]) {
                    barrels[barrel.state][barrel.type] = [];
                }
                barrels[barrel.state][barrel.type].push(barrel);
            }

            this.setState({ barrels });
        }
    }


    render() {
        return (
            <Row className="container-hide">
                <Col sm={4} className="container-hide">
                    <h2>En stock</h2>
                    <div>
                        {
                            Object.keys(this.state.barrels.new).length
                                ?
                                    Object.keys(this.state.barrels.new).map((typeId, i) => {
                                        let type = BarrelTypeStore.findById(typeId);
                                        return <div key={i}>
                                            <Subheader>{type ? type.name : ''}</Subheader>
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

                                    })

                                :
                                    "Aucun fût en stock."
                        }
                    </div>
                </Col>
                <Col sm={4} className="container-hide">
                    <h2>Entamé</h2>
                    <div>
                        {
                            Object.keys(this.state.barrels.opened).length
                                ?
                                    Object.keys(this.state.barrels.opened).map((typeId, i) => {
                                        let type = BarrelTypeStore.findById(typeId);
                                        return <div key={i}>
                                            <Subheader>{type ? type.name : ''}</Subheader>
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
                                    "Aucun fût ouvert."
                        }
                    </div>
                </Col>
                <Col sm={4} className="container-hide">
                    <h2>Terminé</h2>
                    <div>
                        {
                            Object.keys(this.state.barrels.empty).length
                                ?
                                    Object.keys(this.state.barrels.empty).map((typeId, i) => {
                                        let type = BarrelTypeStore.findById(typeId);
                                        return <div key={i}>
                                            <Subheader>{type ? type.name : ''}</Subheader>
                                            <div className="BarrelChipContainer">
                                            {
                                                this.state.barrels.empty[typeId].map((barrel, i) => {
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
                                    "Aucun fût terminé."
                        }
                    </div>
                </Col>
            </Row>
        );
    }

}
