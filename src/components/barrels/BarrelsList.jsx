import React from 'react';

import BarrelStore from '../../stores/BarrelStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';

import CreateBarrels from './CreateBarrels.jsx';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

export default class BarrelsList extends React.Component {

    constructor() {
        super();

        this.state = {
            barrels: [],
            types: [],
            filter: null
        };

        // binding
        this._onBarrelStoreChange = this._onBarrelStoreChange.bind(this);
        this._onBarrelTypeStoreChange = this._onBarrelTypeStoreChange.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        BarrelStore.addChangeListener(this._onBarrelStoreChange);
        BarrelTypeStore.addChangeListener(this._onBarrelTypeStoreChange);
        // init barrels list and barrelTypes list
        this.setState({
            barrels: BarrelStore.barrels,
            types: BarrelTypeStore.types
        });
    }

    componentWillUnmount() {
        // remove the stores listeners
        BarrelStore.removeChangeListener(this._onBarrelStoreChange);
        BarrelTypeStore.removeChangeListener(this._onBarrelTypeStoreChange);
    }

    /**
     * Update the state when the BarrelStore is updated
     */
    _onBarrelStoreChange() {
        this.setState({ barrels: BarrelStore.barrels });
    }

    /**
     * Update the state when the BarrelTypeStore is updated
     */
    _onBarrelTypeStoreChange() {
        this.setState({ types: BarrelTypeStore.types });
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
                <Table>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.state.barrels.map(barrel => {
                                if (!this.state.filter || barrel.type === this.state.filter) {
                                    return <TableRow key={barrel.id}>
                                            <TableRowColumn>{barrel.reference}</TableRowColumn>
                                            <TableRowColumn>{barrel.state}</TableRowColumn>
                                        </TableRow>
                                }
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }

}