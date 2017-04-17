import React from 'react';

import BarrelStore from '../../stores/BarrelStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';
import TeamStore from '../../stores/TeamStore';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MoveDialog from '../stock/MoveDialog.jsx';
import LocationSelect from '../stock/LocationSelect.jsx';

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

        this._barrelStates = {
            "new": "neuf",
            "opened": "entamé",
            "empty": "vide"
        };

        this.BarrelStoreToken = null;
        this.BarrelTypeStoreToken = null;
        this.TeamStoreToken = null;

        // binding
        this._setBarrelTypes = this._setBarrelTypes.bind(this);
        this._setBarrels = this._setBarrels.bind(this);
        this._setTeams = this._setTeams.bind(this);
        this._toggleMoveDialog = this._toggleMoveDialog.bind(this);
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

                return TeamStore.loadData([{role: "bar"}]);
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
        TeamStore.removeChangeListener(this._setBarrels);
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

        const barrels = BarrelStore.barrels;

        if (TeamStore.teams) {
            // for each barrel, get the place data
            for (let barrel of barrels) {
                let team = TeamStore.findById(barrel.place);
                barrel.team = team ? team.name : "reserve";
            }
        }

        this.setState({ barrels });
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

    _toggleMoveDialog() {
        if (this.state.showMoveDialog) {
            this.setState({
                showMoveDialog: false,
                selectedBarrels: []
            });
        } else {
            let selectedBarrels = [];

            if (this.state.selectedRows === "all") {
                const filters = this.state.filters;
                filters.rgx = new RegExp(filters.reference);

                selectedBarrels = this.state.barrels.map(barrel => {
                    if (!filters.types.length || filters.types.includes(barrel.type)) {
                        if (!filters.locations.length || filters.locations.includes(barrel.place)) {
                            if (!filters.states.length || filters.states.includes(barrel.state)) {
                                if (barrel.reference.match(filters.rgx)) {
                                    return barrel;
                                }
                            }
                        }
                    }
                });
            } else if (this.state.selectedRows !== "none") {
                for (let row of this.state.selectedRows) {
                    selectedBarrels.push(this.state.barrels[row]);
                }
            }

            this.setState({
                showMoveDialog: true,
                selectedBarrels
            });
        }
    }

    render() {
        const filters = this.state.filters;
        filters.rgx = new RegExp(filters.reference);

        const states = [];
        for (let state in this._barrelStates) {
            states.push(<MenuItem
                            key={state}
                            insetChildren={true}
                            checked={filters.states.includes(state)}
                            value={state}
                            primaryText={this._barrelStates[state]}
                        />)
        }

        return (
            <div>
                <SelectField
                    multiple={true}
                    hintText="Filtrer par type"
                    value={this.state.filters.types}
                    onChange={(e, i, v) => this._setFilters("types", v)}
                >
                    {
                        this.state.types.map(type => {
                            return <MenuItem
                                key={type.id}
                                insetChildren={true}
                                checked={this.state.filters.types.includes(type.id)}
                                value={type.id}
                                primaryText={type.name}
                            />
                        })
                    }
                </SelectField>

                <LocationSelect
                    teams={this.state.teams}
                    value={this.state.filters.locations}
                    setValue={(e, i, v) => this._setFilters("locations", v)}
                    multiple={true}
                />

                <SelectField
                    multiple={true}
                    hintText="Filtrer par état"
                    value={this.state.filters.states}
                    onChange={(e, i, v) => this._setFilters("states", v)}
                >
                    {states}
                </SelectField>

                <TextField
                    floatingLabelText="Filtrer par référence"
                    value={this.state.filters.reference}
                    onChange={e => this._setFilters("reference", e.target.value)}
                />

                <RaisedButton
                    label="Deplacer"
                    secondary={true}
                    disabled={this.state.selectedRows === "none" || !this.state.selectedRows.length}
                    onClick={this._toggleMoveDialog}
                />

                <Table
                    multiSelectable={true}
                    onRowSelection={rows => this.setState({ selectedRows: rows })}
                >
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Référence</TableHeaderColumn>
                            <TableHeaderColumn>Type</TableHeaderColumn>
                            <TableHeaderColumn>Etat</TableHeaderColumn>
                            <TableHeaderColumn>Emplacement</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                        {
                            this.state.barrels.map(barrel => {
                                if (!filters.types.length || filters.types.includes(barrel.type)) {
                                    if (!filters.locations.length || filters.locations.includes(barrel.place)) {
                                        if (!filters.states.length || filters.states.includes(barrel.state)) {
                                            if (barrel.reference.match(filters.rgx)) {
                                                let type = BarrelTypeStore.findById(barrel.type);
                                                let place = TeamStore.findById(barrel.place);
                                                return  <TableRow key={barrel.id}>
                                                            <TableRowColumn>{barrel.reference}</TableRowColumn>
                                                            <TableRowColumn>{type && type.name}</TableRowColumn>
                                                            <TableRowColumn>{this._barrelStates[barrel.state]}</TableRowColumn>
                                                            <TableRowColumn>{place ? place.name : "reserve"}</TableRowColumn>
                                                        </TableRow>
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    </TableBody>
                </Table>

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
