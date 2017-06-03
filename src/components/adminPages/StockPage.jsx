import React from 'react';

import BarrelStore from 'stores/BarrelStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import BottleActionStore from 'stores/BottleActionStore';
import BottleTypeStore from 'stores/BottleTypeStore';
import TeamStore from 'stores/TeamStore';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';

import { Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import MoveDialog from 'components/stock/MoveDialog.jsx';
import Filters from 'components/stock/Filters.jsx';
import StockList from 'components/stock/StockList.jsx';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import LocalShipping from 'material-ui/svg-icons/maps/local-shipping';
import Navagiation from 'material-ui/svg-icons/maps/navigation';
import Paper from 'material-ui/Paper';

require('styles/stock/StockPage.scss');

export default class StockPage extends React.Component {

    constructor() {
        super();

        this.state = {
            filteredData: [],
            filters: {
                types: [],
                locations: [],
                states: [],
                reference: ""
            },
            selectedRows: [],
            selectedBarrels: new Set(),
            selectedBottles: {},
            showMoveDialog: false
        };

        this.BarrelStoreToken = null;
        this.BarrelTypeStoreToken = null;
        this.TeamStoreToken = null;
        this.BottleActionStoreToken = null;
        this.BottleTypeStoreToken = null;

        // binding
        this._loadData = this._loadData.bind(this);
        this._unloadData = this._unloadData.bind(this);
        this._updateData = this._updateData.bind(this);
        this._toggleMoveDialog = this._toggleMoveDialog.bind(this);
        this._handleBarrelSelection = this._handleBarrelSelection.bind(this);
        this._handleBottleSelection = this._handleBottleSelection.bind(this);
        this._setFilters = this._setFilters.bind(this);
        this._resetFilters = this._resetFilters.bind(this);
    }

    componentDidMount() {
        // Load data from the store
        this._loadData()
        .then(() => {
            // listen the stores changes
            BarrelStore.addChangeListener(this._updateData);
            BarrelTypeStore.addChangeListener(this._updateData);
            TeamStore.addChangeListener(this._updateData);
            BottleActionStore.addChangeListener(this._updateData);
            BottleTypeStore.addChangeListener(this._updateData);
        })
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
        return BarrelStore.loadData(null)
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

            return BottleActionStore.loadCount()
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
        let filteredData = {};

        // Add barrels to filteredData
        const filters = this.state.filters;
        filters.rgx = new RegExp(filters.reference);
        for (let barrel of BarrelStore.barrels) {
            let type = BarrelTypeStore.findById(barrel.typeId)
            if (!filters.types.length || filters.types.includes(barrel.typeId)) {
                if (!filters.locations.length || filters.locations.includes(barrel.teamId)) {
                    if (!filters.states.length || filters.states.includes(barrel.state)) {
                        if (type && ('' + type.shortName + barrel.num).match(filters.rgx)) {
                            // the barrel match the filters
                            if (!filteredData[barrel.teamId]) {
                                filteredData[barrel.teamId] = { barrels: {}, bottles: {} };
                            }
                            if (filteredData[barrel.teamId].barrels[barrel.typeId]) {
                                filteredData[barrel.teamId].barrels[barrel.typeId].push(barrel);
                            } else {
                                filteredData[barrel.teamId].barrels[barrel.typeId] = [barrel];
                            }
                        }
                    }
                }
            }
        }

        // Add bottles to filteredData
        let count = BottleActionStore.count;
        for (let teamId in count) {
            if (!filters.locations.length || filters.locations.includes(teamId != 'null' ? teamId : null)) {
                for(let typeId in count[teamId])
                {
                    let type = BottleTypeStore.findById(typeId);
                    if (!filters.types.length || filters.types.includes('-'+typeId)) {
                        if (type && type.shortName.match(filters.rgx)) {
                            for(let state in count[teamId][typeId]) {
                                if(count[teamId][typeId][state] > 0) {
                                    if (!filters.states.length || filters.states.includes(state)) {
                                        // the bottle match the filters
                                        if (!filteredData[teamId]) {
                                            filteredData[teamId] = { barrels: {}, bottles: {} };
                                        }
                                        if (!filteredData[teamId].bottles[typeId]) {
                                            filteredData[teamId].bottles[typeId] = {};
                                        }
                                        filteredData[teamId].bottles[typeId][state] = count[teamId][typeId][state];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        this.setState({
            filteredData: filteredData,
        });
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
        this._updateData();
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
        this._updateData();
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
            state.selectedBarrels = new Set();
            state.selectedBottles = {};
        }
        state.showMoveDialog = !state.showMoveDialog;
        this.setState(state);
    }

    /**
     * When a barrel is selected, add or remove it from the selected barrels
     * depending of the 'selected' boolean
     *
     * @param {object} clickedBarrel the barrel
     * @param {boolean} selected is the barrel selected or not
     */
    _handleBarrelSelection(clickedBarrel, selected) {
        let selectedBarrels = this.state.selectedBarrels;

        if (selected) {
            selectedBarrels.add(clickedBarrel.id);
        } else {
            selectedBarrels.delete(clickedBarrel.id);
        }

        this.setState({ selectedBarrels });
    }

    /**
     * When a bottle is selected, add or remove it from the selected bottles
     *
     * @param {BottleType} type type of the selected bottle
     * @param {Team} team owner team
     * @param {int} count Number of bottle selected
     */
    _handleBottleSelection(type, team, count) {
        let selectedBottles = this.state.selectedBottles;
        if(team) team = team.id;

        if(!selectedBottles[team || null]) {
            selectedBottles[team || null] = {};
        }

        if (count > 0) {
            selectedBottles[team || null][type.id] = count;
        } else {
            delete selectedBottles[team || null][type.id];
        }

        this.setState({ selectedBottles });
    }

    /**
     * Scroll to the top of the page
     */
    static _scrollTop() {
        document.getElementById('StockPage_Top').scrollTop = 0;
    }

    render() {
        let selectionCount = 0;
        if(this.state.selectedBarrels.size) {
            selectionCount += this.state.selectedBarrels.size;
        }
        if(Object.keys(this.state.selectedBottles).length) {
            for (let teamId in this.state.selectedBottles) {
                selectionCount += Object.keys(this.state.selectedBottles[teamId]).length;
            }
        }

        return (
            <div className="StockPage_container" id="StockPage_Top">
                <Paper className="StockPage_filters_container">
                    <Filters
                        teams={TeamStore.teams}
                        barrelTypes={BarrelTypeStore.types}
                        bottleTypes={BottleTypeStore.types}
                        setFilters={this._setFilters}
                        filters={this.state.filters}
                    />

                    <Row center="md">
                        <Col xs={12} sm={6} md={3}>
                            <RaisedButton
                                label={'Déselectionner les fûts ' + (selectionCount ? '(' + selectionCount + ')' : '')}
                                disabled={selectionCount === 0}
                                onClick={_ => this.setState({ selectedBarrels: new Set(), selectedBottles: {} })}
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
                </Paper>

                <StockList
                    data={this.state.filteredData}
                    handleBarrelSelection={this._handleBarrelSelection}
                    handleBottleSelection={this._handleBottleSelection}
                    selectedBarrels={[...this.state.selectedBarrels]}
                    selectedBottles={this.state.selectedBottles}
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
                        disabled={selectionCount === 0}
                        onClick={this._toggleMoveDialog}
                    >
                        <LocalShipping  />
                    </FloatingActionButton>
                }

                    <MoveDialog
                        show={this.state.showMoveDialog}
                        close={this._toggleMoveDialog}
                        teams={TeamStore.findByPermission('ui/receiveStock')}
                        barrels={[...this.state.selectedBarrels]}
                        bottles={this.state.selectedBottles}
                    />

            </div>
        );
    }

}
