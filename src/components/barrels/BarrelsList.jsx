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

        // binding
        this._onBarrelStoreChange = this._onBarrelStoreChange.bind(this);
        this._onBarrelTypeStoreChange = this._onBarrelTypeStoreChange.bind(this);
        this._toggleEditBarrel = this._toggleEditBarrel.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        BarrelStore.addChangeListener(this._onBarrelStoreChange);
        BarrelTypeStore.addChangeListener(this._onBarrelTypeStoreChange);
        // init barrels list and barrelTypes list
        this.setState({ types: BarrelTypeStore.types });
    }

    componentWillUnmount() {
        // remove the stores listeners
        BarrelStore.removeChangeListener(this._onBarrelStoreChange);
        BarrelTypeStore.removeChangeListener(this._onBarrelTypeStoreChange);
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
     * Update the state when the BarrelStore is updated
     */
    _onBarrelStoreChange() {
        this._updateBarrels();
    }

    /**
     * Update the state when the BarrelTypeStore is updated
     */
    _onBarrelTypeStoreChange() {
        this.setState({ types: BarrelTypeStore.types });
    }

    /**
     *
     */
    _updateBarrels() {
        let barrels = BarrelStore.barrels;

        // for each barrel, get the place data
        for (let barrel of barrels) {
            barrel.team = TeamStore.getTeamName(barrel.place);
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
                                return <MenuItem
                                    value={type.id}
                                    primaryText={type.name}
                                    key={type.id}
                                />
                            })
                        }
                    </SelectField>
                </div>
                <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.state.barrels.map(barrel => {
                                if (!this.state.filter || barrel.type === this.state.filter) {
                                    return <TableRow key={barrel.id}>
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