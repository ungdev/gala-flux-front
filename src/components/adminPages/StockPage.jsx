import React from 'react';

import BarrelStore from '../../stores/BarrelStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';
import TeamStore from '../../stores/TeamStore';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MoveDialog from '../stock/MoveDialog.jsx';
import LocationSelect from '../stock/LocationSelect.jsx';
import BarrelChip from '../barrels/partials/BarrelChip.jsx';

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
     */
    _toggleMoveDialog() {
        if (this.state.showMoveDialog) {
            // hide the dialog and empty the selected barrels
            this.setState({
                showMoveDialog: false,
                selectedBarrels: []
            });
        } else {
            // show the dialog
            this.setState({
                showMoveDialog: true
            });
        }
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

    render() {
        const styles = {
            barrelChip: {
                display: "inline-block"
            },
            barrelChipContainer: {
                marginBottom: 20
            }
        };

        const filteredBarrels = this._filteredBarrels();

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
                    <MenuItem insetChildren={true} checked={this.state.filters.states.includes("new")} value={"new"} primaryText={"Neuf"} />
                    <MenuItem insetChildren={true} checked={this.state.filters.states.includes("opened")} value={"opened"} primaryText={"Entamé"} />
                    <MenuItem insetChildren={true} checked={this.state.filters.states.includes("empty")} value={"empty"} primaryText={"Terminé"} />
                </SelectField>

                <TextField
                    floatingLabelText="Filtrer par référence"
                    value={this.state.filters.reference}
                    onChange={e => this._setFilters("reference", e.target.value)}
                />

                <RaisedButton
                    label="Deplacer"
                    secondary={true}
                    disabled={this.state.selectedBarrels.length === 0}
                    onClick={this._toggleMoveDialog}
                />

                {
                    Object.keys(filteredBarrels).map(location => {
                        let team = TeamStore.findById(location);
                        return  <div key={location}>
                                    <h2>{team ? team.name : "reserve"}</h2>
                                    {
                                        Object.keys(filteredBarrels[location]).map(typeId => {
                                            let type = BarrelTypeStore.findById(typeId);
                                            return  <div key={typeId} style={styles.barrelChipContainer}>
                                                        <h3>{type.name}</h3>
                                                        <div className="BarrelChipContainer">
                                                            {
                                                                filteredBarrels[location][typeId].map(barrel => {
                                                                    return  <BarrelChip
                                                                                onSelection={this._handleBarrelSelection}
                                                                                key={barrel.id}
                                                                                type={type}
                                                                                barrel={barrel}
                                                                                selectable={true}
                                                                            />
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                        })
                                    }
                                </div>

                    })
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
