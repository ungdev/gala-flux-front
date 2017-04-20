import React from 'react';

import BarrelStore from '../../stores/BarrelStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';
import TeamStore from '../../stores/TeamStore';
import AuthStore from '../../stores/AuthStore';

import { Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import MoveDialog from '../stock/MoveDialog.jsx';
import Filters from '../stock/Filters.jsx';
import StockList from '../stock/StockList.jsx';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import LocalShipping from 'material-ui/svg-icons/maps/local-shipping';
import Navagiation from 'material-ui/svg-icons/maps/navigation';

require('../../styles/stock/StockPage.scss');

export default class StockPage extends React.Component {

    constructor() {
        super();

        this.state = {
            barrels: [],
            types: [],
            teams: [],
            filters: {
                types: [],
                locations: [],
                states: [],
                reference: ""
            },
            selectedRows: [],
            selectedBarrels: [],
            showMoveDialog: false
        };

        this.BarrelStoreToken = null;
        this.BarrelTypeStoreToken = null;
        this.TeamStoreToken = null;

        // binding
        this._setBarrelTypes = this._setBarrelTypes.bind(this);
        this._setBarrels = this._setBarrels.bind(this);
        this._setTeams = this._setTeams.bind(this);
        this._toggleMoveDialog = this._toggleMoveDialog.bind(this);
        this._filteredBarrels = this._filteredBarrels.bind(this);
        this._handleBarrelSelection = this._handleBarrelSelection.bind(this);
        this._setFilters = this._setFilters.bind(this);
        this._resetFilters = this._resetFilters.bind(this);
    }

    componentDidMount() {
        // fill the stores
        BarrelStore.loadData(null)
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

                return TeamStore.loadData(null);
            })
            .then(data => {
                // ensure that last token doesn't exist anymore.
                TeamStore.unloadData(this.TeamStoreToken);
                // save the component token
                this.TeamStoreToken = data.token;

                // listen the stores changes
                BarrelStore.addChangeListener(this._setBarrels);
                BarrelTypeStore.addChangeListener(this._setBarrelTypes);
                TeamStore.addChangeListener(this._setTeams);
                // init barrels, barrel types, and teams
                this._setBarrels();
                this._setBarrelTypes();
                this._setTeams();
            })
            .catch(error => console.log("fill stores for stockPage error", error));
    }

    componentWillUnmount() {
        // clear stores
        BarrelStore.unloadData(this.BarrelStoreToken);
        BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);
        TeamStore.unloadData(this.TeamStoreToken);
        // remove the listeners
        BarrelStore.removeChangeListener(this._setBarrels);
        BarrelTypeStore.removeChangeListener(this._setBarrelTypes);
        TeamStore.removeChangeListener(this._setTeams);
    }

    /**
     * Set the barrel types in the state
     */
    _setBarrelTypes() {
        this.setState({ types: BarrelTypeStore.types });
    }

    /**
     * Set the teams in the state
     */
    _setTeams() {
        this.setState({ teams: TeamStore.teams });
    }

    /**
     * Set the barrels in the state.
     * Get the team name of each barrel in the same time.
     */
    _setBarrels() {
        this.setState({ barrels: BarrelStore.barrels });
    }

    /**
     * Update a filter in the state
     *
     * @param attribute: the filter to update
     * @param value: the new filter value
     */
    _setFilters(attribute, value) {
        let state = this.state;
        state.filters[attribute] = value;
        this.setState(state);
    }

    /**
     * Reset the filters in the state
     */
    _resetFilters() {
        this.setState({
            filters: {
                types: [],
                locations: [],
                states: [],
                reference: ""
            }
        });
    }

    /**
     * Get only the barrels in the state that matches the filters
     *
     * @returns {Array} array of barrels
     */
    _filteredBarrels() {
        const filters = this.state.filters;
        filters.rgx = new RegExp(filters.reference);

        let barrels = {};

        for (let barrel of this.state.barrels) {
            if (!filters.types.length || filters.types.includes(barrel.type)) {
                if (!filters.locations.length || filters.locations.includes(barrel.place)) {
                    if (!filters.states.length || filters.states.includes(barrel.state)) {
                        if (barrel.reference.match(filters.rgx)) {
                            // the barrel match the filters
                            if (!barrels[barrel.place]) {
                                barrels[barrel.place] = {};
                            }
                            if (barrels[barrel.place][barrel.type]) {
                                barrels[barrel.place][barrel.type].push(barrel);
                            } else {
                                barrels[barrel.place][barrel.type] = [barrel];
                            }
                        }
                    }
                }
            }
        }

        return barrels;
    }

    /**
     * Toggle the boolean that show/hide the dialog to move barrels.
     * If we display the dialog, get the selected barrels.
     * Else, empty the array that contains the selected barrels.
     *
     * @param {boolean|undefined} emptySelected
     */
    _toggleMoveDialog(emptySelected) {
        let state = this.state;
        if (emptySelected === true) {
            state.selectedBarrels = [];
        }
        state.showMoveDialog = !state.showMoveDialog;
        this.setState(state);
    }

    /**
     * When a barrel is selected, add or remove it from the selected barrels
     * depending of the 'selected' boolean
     *
     * @param {object} clickedBarrel: the barrel
     * @param {boolean} selected: is the barrel selected or not
     */
    _handleBarrelSelection(clickedBarrel, selected) {
        let selectedBarrels = this.state.selectedBarrels;

        if (selected) {
            selectedBarrels.push(clickedBarrel);
        } else {
            selectedBarrels = selectedBarrels.filter(barrel => barrel !== clickedBarrel);
        }

        this.setState({ selectedBarrels });
    }

    /**
     * Scroll to the top of the page
     */
    static _scrollTop() {
        document.getElementById('StockPage_Top').scrollTop = 0;
    }

    render() {

        return (
            <div className="StockPage_container" id="StockPage_Top">
                <div className="StockPage_filters_container">
                    <Filters
                        teams={this.state.teams}
                        types={this.state.types}
                        setFilters={this._setFilters}
                        filters={this.state.filters}
                    />

                    <Row center="md">
                        <Col xs={12} sm={6} md={3}>
                            <RaisedButton
                                label={`Déselectionner les fûts ${(this.state.selectedBarrels.length ? `(${this.state.selectedBarrels.length })` : '')}`}
                                primary={true}
                                disabled={this.state.selectedBarrels.length === 0}
                                onClick={_ => this.setState({ selectedBarrels: [] })}
                                fullWidth={true}
                            />
                        </Col>
                        <Col xs={12} sm={6} md={3}>
                            <RaisedButton
                                label="Reset les filtres"
                                secondary={true}
                                onClick={this._resetFilters}
                                fullWidth={true}
                            />
                        </Col>
                    </Row>
                </div>

                <StockList
                    barrels={this._filteredBarrels()}
                    handleBarrelSelection={this._handleBarrelSelection}
                    selected={this.state.selectedBarrels}
                />


                <FloatingActionButton
                    className="FloatingButton--secondary"
                    onClick={StockPage._scrollTop}
                    secondary={true}
                >
                    <Navagiation  />
                </FloatingActionButton>


                { AuthStore.can('barrel/admin') &&
                    <FloatingActionButton
                        className="FloatingButton"
                        disabled={this.state.selectedBarrels.length === 0}
                        onClick={this._toggleMoveDialog}
                    >
                        <LocalShipping  />
                    </FloatingActionButton>
                }

                    <MoveDialog
                        show={this.state.showMoveDialog}
                        close={this._toggleMoveDialog}
                        teams={this.state.teams}
                        barrels={this.state.selectedBarrels}
                    />

            </div>
        );
    }

}
