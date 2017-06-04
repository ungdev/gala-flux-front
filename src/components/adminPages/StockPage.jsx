import React from 'react';

import BottleActionStore from 'stores/BottleActionStore';
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
import DataLoader from 'components/partials/DataLoader.jsx';

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
            showMoveDialog: false,
            datastore: null,
        };


        // binding
        this.toggleMoveDialog = this.toggleMoveDialog.bind(this);
        this.handleBarrelSelection = this.handleBarrelSelection.bind(this);
        this.handleBottleSelection = this.handleBottleSelection.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.setFilters = this.setFilters.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
        this.handleDatastoreChange = this.handleDatastoreChange.bind(this);
    }

    /**
     * Update state when store are updated
     */
    handleDatastoreChange(datastore) {
        this.applyFilter(datastore);
    }

    /**
     * Apply filter to data in the given datastore and save it in state
     */
    applyFilter(datastore) {
        if(!datastore) datastore = this.state.datastore;
        let filteredData = {};

        // Add barrels to filteredData
        const filters = this.state.filters;
        filters.rgx = new RegExp(filters.reference);
        for (let barrel of datastore.Barrel.values()) {
            let type = datastore.BarrelType.get(barrel.typeId)
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
                    let type = datastore.BottleType.get(typeId);
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
            filteredData,
            datastore,
            teams: datastore.Team,
            bottleTypes: datastore.BottleType,
            barrelTypes: datastore.BarrelType,
        });
    }

    /**
     * Update a filter in the state
     *
     * @param attribute: the filter to update
     * @param value: the new filter value
     */
    setFilters(attribute, value) {
        let state = this.state;
        state.filters[attribute] = value;
        this.setState(state);
        this.applyFilter();
    }

    /**
     * Reset the filters in the state
     */
    resetFilters() {
        this.setState({
            filters: {
                types: [],
                locations: [],
                states: [],
                reference: ""
            }
        });
        this.applyFilter();
    }

    /**
     * Toggle the boolean that show/hide the dialog to move barrels.
     * If we display the dialog, get the selected barrels.
     * Else, empty the array that contains the selected barrels.
     *
     * @param {boolean|undefined} emptySelected
     */
    toggleMoveDialog(emptySelected) {
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
    handleBarrelSelection(clickedBarrel, selected) {
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
    handleBottleSelection(type, team, count) {
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
    static scrollTop() {
        document.getElementById('StockPageTop').scrollTop = 0;
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
            <DataLoader
                filters={new Map([
                    ['Barrel', null],
                    ['BarrelType', null],
                    ['BottleAction', null],
                    ['BottleType', null],
                    ['Team', null],
                ])}
                onChange={ datastore => this.handleDatastoreChange(datastore) }
            >
                { () => (
                    <div className="StockPage_container" id="StockPageTop">
                        <Paper className="StockPage_filters_container">
                            <Filters
                                teams={this.state.teams}
                                barrelTypes={this.state.barrelTypes}
                                bottleTypes={this.state.bottleTypes}
                                setFilters={this.setFilters}
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
                                        onClick={this.resetFilters}
                                        fullWidth={true}
                                    />
                                </Col>
                            </Row>
                        </Paper>

                        <StockList
                            teams={this.state.teams}
                            barrelTypes={this.state.barrelTypes}
                            bottleTypes={this.state.bottleTypes}
                            data={this.state.filteredData}
                            handleBarrelSelection={this.handleBarrelSelection}
                            handleBottleSelection={this.handleBottleSelection}
                            selectedBarrels={[...this.state.selectedBarrels]}
                            selectedBottles={this.state.selectedBottles}
                        />


                        <FloatingActionButton
                            className="FloatingButton--secondary"
                            onClick={StockPage.scrollTop}
                            secondary={true}
                        >
                            <Navagiation  />
                        </FloatingActionButton>


                        { AuthStore.can('barrel/admin') &&
                            <FloatingActionButton
                                className="FloatingButton"
                                disabled={selectionCount === 0}
                                onClick={this.toggleMoveDialog}
                            >
                                <LocalShipping  />
                            </FloatingActionButton>
                        }

                            <MoveDialog
                                show={this.state.showMoveDialog}
                                close={this.toggleMoveDialog}
                                barrels={[...this.state.selectedBarrels]}
                                bottles={this.state.selectedBottles}
                                teams={this.state.teams}
                                barrelTypes={this.state.barrelTypes}
                                bottleTypes={this.state.bottleTypes}
                            />

                    </div>
                )}
            </DataLoader>
        );
    }

}
