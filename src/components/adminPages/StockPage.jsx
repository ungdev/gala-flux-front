import React from 'react';

import BarrelStore from '../../stores/BarrelStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';
import TeamStore from '../../stores/TeamStore';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

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
            }
        };

        this._barrelStates = [
            {
                value: "new",
                name: "neuf"
            },
            {
                value: "opened",
                name: "entamé"
            },
            {
                value: "empty",
                name: "vide"
            }
        ];

        this.BarrelStoreToken = null;
        this.BarrelTypeStoreToken = null;
        this.TeamStoreToken = null;

        // binding
        this._setBarrelTypes = this._setBarrelTypes.bind(this);
        this._setBarrels = this._setBarrels.bind(this);
        this._setTeams = this._setTeams.bind(this);
    }

    componentDidMount() {
        // fill the stores
        BarrelStore.loadData(null)
            .then(data => {
                // ensure that last token doen't exist anymore.
                BarrelStore.unloadData(this.BarrelStoreToken);
                // save the component token
                this.BarrelStoreToken = data.token;

                return BarrelTypeStore.loadData(null);
            })
            .then(data => {
                // ensure that last token doen't exist anymore.
                BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);
                // save the component token
                this.BarrelTypeStoreToken = data.token;

                return TeamStore.loadData([{role: "bar"}]);
            })
            .then(data => {
                // ensure that last token doen't exist anymore.
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

    render() {
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

                <SelectField
                    multiple={true}
                    hintText="Filtrer par emplacement"
                    value={this.state.filters.locations}
                    onChange={(e, i, v) => this._setFilters("locations", v)}
                >
                    <MenuItem
                        key={0}
                        insetChildren={true}
                        checked={this.state.filters.locations.includes(null)}
                        value={null}
                        primaryText={"reserve"}
                    />
                    {
                        this.state.teams.map(team => {
                            return <MenuItem
                                key={team.id}
                                insetChildren={true}
                                checked={this.state.filters.locations.includes(team.id)}
                                value={team.id}
                                primaryText={team.name}
                            />
                        })
                    }
                </SelectField>

                <SelectField
                    multiple={true}
                    hintText="Filtrer par état"
                    value={this.state.filters.states}
                    onChange={(e, i, v) => this._setFilters("states", v)}
                >
                    {
                        this._barrelStates.map((state, i) => {
                            return <MenuItem
                                key={i}
                                insetChildren={true}
                                checked={this.state.filters.states.includes(state.value)}
                                value={state.value}
                                primaryText={state.name}
                            />
                        })
                    }
                </SelectField>

                <TextField
                    floatingLabelText="Filtrer par référence"
                    value={this.state.filters.reference}
                    onChange={e => this._setFilters("reference", e.target.value)}
                />
            </div>
        );
    }

}
