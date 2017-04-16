import React from 'react';

import BarrelTypeService from '../../services/BarrelTypeService';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';

export default class CreateBarrels extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            types: props.types,
            showForm: false,
            formData: {
                id: null,
                number: 0
            },
            created: []
        };

        // binding
        this._toggleFormDialog = this._toggleFormDialog.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._setFormDataAttribute = this._setFormDataAttribute.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ types: nextProps.types });
    }

    /**
     * Toggle the boolean value to show/hide the form to create a new barrel
     */
    _toggleFormDialog() {
        this.setState({ showForm: !this.state.showForm })
    }

    /**
     * Update the value of an attribute of the barrel in creation
     *
     * @param {string} attribute: the attribute to update
     * @param {string} value: the new value of this attribute
     */
    _setFormDataAttribute(attribute, value) {
        const state = this.state;

        if (attribute === "number") {
            if (!value) {
                state.formData.number = 0
            } else {
                let intVal = parseInt(value);
                if (intVal) {
                    state.formData.number = intVal;
                }
            }
        } else {
            state.formData[attribute] = value;
        }

        this.setState(state);
    }

    /**
     * Call the Service to create new barrels of a type
     */
    _submitForm() {
        BarrelTypeService.saveBarrels(this.state.formData)
            .then(barrels => this.setState({ created: barrels.data }))
            .catch(error => console.log("save barrels erro: ", error));
    }

    render() {

        const actions = [
            <FlatButton
                label="Créer les fûts"
                primary={true}
                onClick={this._submitForm}
            />,
            <FlatButton
                label="Fermer"
                secondary={true}
                onClick={this._toggleFormDialog}
            />
        ];

        const styles = {
            chip: {
                display: "inline-block"
            }
        };

        return (
            <div>
                <RaisedButton
                    label="Ajouter des fûts"
                    primary={true}
                    onClick={this._toggleFormDialog}
                />

                <Dialog
                    title="Ajout de fûts"
                    open={this.state.showForm}
                    modal={true}
                    onRequestClose={this._toggleFormDialog}
                    actions={actions}
                >
                    <div>
                        <SelectField
                            fullWidth={true}
                            onChange={(e, i, v) => this._setFormDataAttribute("id", v)}
                            value={this.state.formData.id}
                            floatingLabelText="Type de fût"
                        >
                            {
                                this.state.types.map((type, i) => {
                                    return  <MenuItem
                                                key={i}
                                                value={type.id}
                                                primaryText={type.name}
                                            />
                                })
                            }
                        </SelectField>
                    </div>
                    <div>
                        <TextField
                            fullWidth={true}
                            floatingLabelText="Nombre de fûts à créer"
                            value={this.state.formData.number}
                            onChange={e => this._setFormDataAttribute("number", e.target.value)}
                            type="number"
                        />
                    </div>
                    {
                        this.state.created.length > 0 &&
                        <div>
                            <p>Fûts créés : </p>
                            {
                                this.state.created.map(c => {
                                    return  <Chip key={c.id} style={styles.chip}>
                                        {c.reference}
                                    </Chip>
                                })
                            }
                        </div>
                    }
                </Dialog>
            </div>
        );
    }

}