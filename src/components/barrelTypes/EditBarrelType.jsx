import React from 'react';

import BarrelTypeService from '../../services/BarrelTypeService';

import Dialog from 'material-ui/Dialog';
import { Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Delete from 'material-ui/svg-icons/action/delete';

export default class EditBarrelType extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: props.type
        };

        // binding
        this._submitForm = this._submitForm.bind(this);
        this._setAttribute = this._setAttribute.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ type: nextProps.type });
    }

    _setAttribute(attribute, value) {
        const numberAttributes = ["sellPrice", "supplierPrice", "liters"];
        const state = this.state;

        // in case of an attribute which is a number
        if (numberAttributes.indexOf(attribute) == -1) {
            state.type[attribute] = value;
            this.setState(state);
        } else {
            // if null, set to 0
            if (!value) {
                state.type[attribute] = 0;
                this.setState(state);
            } else {
                // check if it's a valid number before setting the state
                const parsedValue = Number(parseFloat(value));
                if ((parsedValue == value) && parsedValue >= 0) {
                    state.type[attribute] = value;
                    this.setState(state);
                }
            }
        }
    }

    _submitForm() {
        BarrelTypeService.updateBarrelType(this.state.type.id, this.state.type, (error, result) => {
            if (error) {
                console.log("update barrel type error", error);
            } else {
                this.props.close();
            }
        });
    }

    render() {
        const actions = [
            <FlatButton
                label="Modifier"
                primary={true}
                onClick={this._submitForm}
            />,
            <FlatButton
                label="Annuler"
                secondary={true}
                onClick={this.props.close}
            />,
            <RaisedButton
                secondary={true}
                icon={<Delete />}
                onClick={this._deleteButton}
            />
        ];

        const type = this.state.type;

        if (!type) {
            return <div></div>
        }

        return (
            <div>
                <Dialog
                    title="Modification d'un type de fût"
                    open={this.props.show}
                    modal={true}
                    onRequestClose={this.props.close}
                    actions={actions}
                >
                    <Row>
                        <Col xs={12}>
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Nom complet du fût"
                                value={type.name}
                                onChange={e => this._setAttribute("name", e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Abréviation"
                                value={type.shortName}
                                onChange={e => this._setAttribute("shortName", e.target.value)}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Nombre de litres"
                                value={type.liters}
                                onChange={e => this._setAttribute("liters", e.target.value)}
                                type="number"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Prix fournisseur"
                                value={type.supplierPrice}
                                onChange={e => this._setAttribute("supplierPrice", e.target.value)}
                                type="number"
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Prix de vente"
                                value={type.sellPrice}
                                onChange={e => this._setAttribute("sellPrice", e.target.value)}
                                type="number"
                            />
                        </Col>
                    </Row>
                </Dialog>
            </div>
        );
    }

}