import React from 'react';

import BarrelStore from '../../stores/BarrelStore';

import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

export default class BarrelsList extends React.Component {

    constructor() {
        super();

        this.state = {
            barrels: []
        };

        // binding
        this._onBarrelStoreChange = this._onBarrelStoreChange.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        BarrelStore.addChangeListener(this._onBarrelStoreChange);
        // init barrels list
        this.setState({ barrels: BarrelStore.barrels });
    }

    componentWillUnmount() {
        // remove the stores listeners
        BarrelStore.removeChangeListener(this._onBarrelStoreChange);
    }

    /**
     * Update the state when the BarrelStore is updated
     */
    _onBarrelStoreChange() {
        this.setState({ barrels: BarrelStore.barrels });
    }

    render() {
        return (
            <div>
                <Table>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.state.barrels.map(barrel => {
                                return  <TableRow key={barrel.id}>
                                            <TableRowColumn>{barrel.reference}</TableRowColumn>
                                            <TableRowColumn>{barrel.state}</TableRowColumn>
                                        </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }

}