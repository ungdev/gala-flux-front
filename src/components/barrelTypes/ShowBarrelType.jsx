import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

export default class ShowBarrelType extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: props.type
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ type: nextProps.type });
    }

    render() {
        const actions = [
            <FlatButton
                label="Fermer"
                secondary={true}
                onClick={this.props.close}
            />
        ];

        const type = this.state.type;

        return (
            <Dialog
                title="Creation d'un type de fût"
                open={this.props.show}
                modal={true}
                onRequestClose={this.props.close}
                actions={actions}
            >
                {
                    type &&
                    <Table>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow>
                                <TableRowColumn>Nom</TableRowColumn>
                                <TableRowColumn>{type.name}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>Abréviation</TableRowColumn>
                                <TableRowColumn>{type.shortName}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>Nombres de litres</TableRowColumn>
                                <TableRowColumn>{type.liters}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>Prix fournisseur</TableRowColumn>
                                <TableRowColumn>{type.supplierPrice}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>Prix de vente</TableRowColumn>
                                <TableRowColumn>{type.sellPrice}</TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                }
            </Dialog>
        )
    }

}