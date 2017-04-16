import React from 'react';

import BarrelTypeService from '../../services/BarrelTypeService';

import Dialog from 'material-ui/Dialog';
import { Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class NewBarrelType extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            formData: {
                name: {
                    error: null,
                    value: ""
                },
                shortName: {
                    error: null,
                    value: ""
                },
                liters: {
                    value: 0
                },
                supplierPrice: {
                    value: 0
                },
                sellPrice: {
                    value: 0
                }
            }
        };

        // binding
        this._setFormDataAttribute = this._setFormDataAttribute.bind(this);
        this._submitForm = this._submitForm.bind(this);
    }

    /**
     * Update an attribute of the barrel type object in the component state
     *
     * @param {string} attribute
     * @param {string|boolean} value
     */
    _setFormDataAttribute(attribute, value) {
        const numberAttributes = ["sellPrice", "supplierPrice", "liters"];
        const state = this.state;

        // in case of an attribute which is a number
        if (numberAttributes.indexOf(attribute) == -1) {
            state.formData[attribute].value = value;
            this.setState(state);
        } else {
            // if null, set to 0
            if (!value) {
                state.formData[attribute].value = 0;
                this.setState(state);
            } else {
                // check if it's a valid number before setting the state
                const parsedValue = Number(parseFloat(value));
                if ((parsedValue == value) && parsedValue >= 0) {
                    state.formData[attribute].value = value;
                    this.setState(state);
                }
            }
        }
    }

    /**
     * Check if the fields are valid
     * In this case, call the AlertButtonService to create a new AlertButton
     */
    _submitForm() {
        const state = this.state;

        // check if there is a name
        let errCounter = 0;
        if (!state.formData.name.value) {
            state.formData.name.error = "Veuillez renseigner le nom du fût.";
            errCounter++;
        } else {
            state.formData.name.error = null;
        }
        if (!state.formData.shortName.value) {
            state.formData.shortName.error = "Veuillez renseigner une abréviation pour ce fût.";
            errCounter++;
        } else if (state.formData.shortName.value.length > 3) {
            state.formData.shortName.error = "L'abréviation est trop longue.";
            errCounter++;
        } else {
            state.formData.name.error = null;
        }

        // if no errors, submit the form
        if (errCounter === 0) {
            const data = {
                name: state.formData.name.value,
                shortName: state.formData.shortName.value,
                sellPrice: state.formData.sellPrice.value,
                supplierPrice: state.formData.supplierPrice.value,
                liters: state.formData.liters.value,
            };

            BarrelTypeService.create(data)
                .then(_ => this.props.close())
                .catch(error => console.log("create barrel error : ", error));
        } else {
            // display errors
            this.setState(state);
        }
    }

    render() {
        const formData = this.state.formData;

        const actions = [
            <FlatButton
                label="Créer le type"
                primary={true}
                onClick={this._submitForm}
            />,
            <FlatButton
                label="Annuler"
                secondary={true}
                onClick={this.props.close}
            />
        ];


        return (
            <Dialog
                title="Creation d'un type de fût"
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
                            value={formData.name.value}
                            onChange={e => this._setFormDataAttribute("name", e.target.value)}
                            errorText={formData.name.error}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6}>
                        <TextField
                            fullWidth={true}
                            floatingLabelText="Abréviation"
                            value={formData.shortName.value}
                            onChange={e => this._setFormDataAttribute("shortName", e.target.value)}
                            errorText={formData.shortName.error}
                        />
                    </Col>
                    <Col xs={12} sm={6}>
                        <TextField
                            fullWidth={true}
                            floatingLabelText="Nombre de litres"
                            value={formData.liters.value}
                            onChange={e => this._setFormDataAttribute("liters", e.target.value)}
                            type="number"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6}>
                        <TextField
                            fullWidth={true}
                            floatingLabelText="Prix fournisseur"
                            value={formData.supplierPrice.value}
                            onChange={e => this._setFormDataAttribute("supplierPrice", e.target.value)}
                            type="number"
                        />
                    </Col>
                    <Col xs={12} sm={6}>
                        <TextField
                            fullWidth={true}
                            floatingLabelText="Prix de vente"
                            value={formData.sellPrice.value}
                            onChange={e => this._setFormDataAttribute("sellPrice", e.target.value)}
                            type="number"
                        />
                    </Col>
                </Row>
            </Dialog>
        )
    }

}