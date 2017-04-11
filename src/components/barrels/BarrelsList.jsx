import React from 'react';

import BarrelStore from '../../stores/BarrelStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';
import TeamStore from '../../stores/TeamStore';

import CreateBarrels from './CreateBarrels.jsx';
import EditBarrel from './EditBarrel.jsx';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui/svg-icons/action/settings';

export default class BarrelsList extends React.Component {

    constructor() {
        super();

        this.state = {
            barrels: [],
            types: [],
            filter: null,
            openEdit: false,
            toEdit: null
        };

        this.BarrelStoreToken = null;

        // binding
        this._onBarrelTypeStoreChange = this._onBarrelTypeStoreChange.bind(this);
        this._toggleEditBarrel = this._toggleEditBarrel.bind(this);
        this._setBarrels = this._setBarrels.bind(this);
    }

    componentDidMount() {
        // fill the store
        BarrelStore.loadData(null)
            .then(data => {
                // save the component token
                this.BarrelStoreToken = data.token;
            })
            .catch(error => console.log("load barrel error", error));
        // listen the stores changes
        BarrelStore.addChangeListener(this._setBarrels);
        BarrelTypeStore.addChangeListener(this._onBarrelTypeStoreChange);
        TeamStore.addChangeListener(this._setBarrels);
        // init barrels list and barrelTypes list
        this._setBarrels();
    }

    componentWillUnmount() {
        // clear store
        BarrelStore.unloadData(this.BarrelStoreToken);
        // remove the stores listeners
        BarrelStore.removeChangeListener(this._setBarrels);
        BarrelTypeStore.removeChangeListener(this._onBarrelTypeStoreChange);
        TeamStore.removeChangeListener(this._setBarrels);
    }

    /**
     * Toggle the boolean to show the dialog to edit a barrel
     */
    _toggleEditBarrel(barrel) {
        this.setState({
            openEdit: !this.state.openEdit,
            toEdit: barrel
        });
    }

    /**
     * Update the state when the BarrelTypeStore is updated
     */
    _onBarrelTypeStoreChange() {
        this.setState({ types: BarrelTypeStore.types });
    }

    /**
     * Set the barrels in the state.
     * Get the team name of each barrel in the same time.
     */
    _setBarrels() {
        let barrels = BarrelStore.barrels;

        if (TeamStore.teams) {
            // for each barrel, get the place data
            for (let barrel of barrels) {
                barrel.team = TeamStore.getTeamName(barrel.place);
            }
        }

        this.setState({ barrels });
    }

    render() {
        return (
            <div>
                <CreateBarrels types={this.state.types} />
                <div>
                    <SelectField
                        fullWidth={true}
                        floatingLabelText="Filtrer par type"
                        value={this.state.filter}
                        onChange={(e, i, v) => this.setState({ filter: v })}
                    >
                        <MenuItem key={-1} value={null} primaryText="" />
                        {
                            this.state.types.map(type => {
                                return <MenuItem value={type.id} primaryText={type.name} key={type.id} />
                            })
                        }
                    </SelectField>
                </div>
                <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.state.barrels.map(barrel => {
                                if (!this.state.filter || barrel.type === this.state.filter) {
                                    return  <TableRow key={barrel.id}>
                                                <TableRowColumn>{barrel.reference}</TableRowColumn>
                                                <TableRowColumn>{barrel.team}</TableRowColumn>
                                                <TableRowColumn>
                                                    <IconButton
                                                        tooltip="SVG Icon"
                                                        onClick={_ => this._toggleEditBarrel(barrel)}
                                                    >
                                                        <Settings />
                                                    </IconButton>
                                                </TableRowColumn>
                                            </TableRow>
                                }
                            })
                        }
                    </TableBody>
                </Table>

                <EditBarrel
                    show={this.state.openEdit}
                    close={this._toggleEditBarrel}
                    barrel={this.state.toEdit}
                    teams={TeamStore.teams}
                />

            </div>
        );
    }

}