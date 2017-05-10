import React from 'react';

import Dialog from 'components/partials/ResponsiveDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Grid, Row, Col } from 'react-flexbox-grid';

import BarrelTypeService from 'services/BarrelTypeService';
import NotificationActions from 'actions/NotificationActions';
import Confirm from 'components/partials/Confirm.jsx';


/**
 * @param {BarrelType} type
 * @param {integer} count Current number of barrels in this type
 */
export default class UpdateBarrelTypeDialog extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            type: props.type,
            values: {
                'name': props.type ? props.type.name : null,
                'shortName': props.type ? props.type.shortName : null,
                'liters': props.type ? props.type.liters : null,
                'sellPrice': props.type ? props.type.sellPrice : null,
                'supplierPrice': props.type ? props.type.supplierPrice : null,
                'count': (props.count ? props.count : 0),
            },
            errors: {},
            shortNameModified: true,
            showReduceDialog: false,
            showDeleteDialog: false,
        };

        this.submitted = false,

        // binding
        this._handleFieldChange = this._handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
    }

    componentWillReceiveProps(props) {
        if(!this.submitted) {
            this.setState({
                type: props.type,
                values: {
                    'name': props.type ? props.type.name : this.state.values.name,
                    'shortName': props.type ? props.type.shortName : this.state.values.shortName,
                    'liters': props.type ? props.type.liters : this.state.values.liters,
                    'sellPrice': props.type ? props.type.sellPrice : this.state.values.sellPrice,
                    'supplierPrice': props.type ? props.type.supplierPrice : this.state.values.supplierPrice,
                    'count': (props.count ? props.count : this.state.values.count),
                },
                errors: {},
            });
        }
    }


    /**
     * Called on field change
     *
     * @param  {string} field Field name
     * @param  {string} value New value
     */
    _handleFieldChange(field, value) {
        let values = this.state.values;
        values[field] = value;
        let shortNameModified = this.state.shortNameModified;

        // Set shortName modification flag
        if(field == 'shortName') {
            shortNameModified = (value != '');
        }
        else if(values.shortName == '') {
            shortNameModified = false;
        }

        // Float number testing
        const numberAttributes = ["sellPrice", "supplierPrice", "liters"];
        if (numberAttributes.indexOf(field) != -1) {
            values[field] = values[field].replace(',', '.').replace(/[^0-9\.]/, '');
        }

        // Integer number testing
        if(!shortNameModified && field == 'count') {
            values[field] = values[field].replace(/[^0-9]/, '');
        }

        // Generate shortname
        if(!shortNameModified && field == 'name') {
            let words = value.split(' ');
            if(words.length > 2 && words[2]) {
                values.shortName = (words[0][0] + words[1][0] + words[2][0]).toUpperCase().trim();
            }
            else if(words.length > 1 && words[1]) {
                values.shortName = (words[0][0] + words[1][0]).toUpperCase().trim();
            }
            else {
                values.shortName = value.substr(0,3).toUpperCase().trim();
            }
        }

        // shortName testing
        if (field == 'name' || field == 'shortName') {
            values.shortName = values.shortName.toUpperCase().replace(/[^A-z]/, '');
        }

        this.setState({
            values: values,
            errors: {},
            shortNameModified: shortNameModified
        });
    }

    /**
     * Call the BarrelType Service to update BarrelType
     *
     * @param {Event} e Event like form submit that will be stopped
     * @param {boolean} confirm has to be set to true to reduce barrel number
     */
    _handleSubmit(e, confirm) {
        if(e) {
            e.preventDefault();
        }

        // Check if barrel number has been reduced and warn if so
        if(confirm !== true && this.props.count > this.state.values.count) {
            this.setState({showReduceDialog: true});
            return;
        }



        // Submit
        this.submitted = true;
        BarrelTypeService.update(this.state.type.id, this.state.values)
        .then((type) => {

            // Set the barrel number
            return BarrelTypeService.setBarrelNumber(type.id, this.state.values.count);
        })
        .then(() => {
            this.setState({
                errors: {},
                showReduceDialog: false,
            });

            this.submitted = false;
            NotificationActions.snackbar('Les fûts ' + this.state.values.name + ' ont bien été modifiés.');
            if(this.focusField) this.focusField.focus();
            this.props.close();
        })
        .catch((error) => {
            this.submitted = false;

            let errors = {};
            if(error.status === 'ValidationError' && error.formErrors) {
                for (let field in error.formErrors) {
                    if(error.formErrors[field][0].rule == 'string') {
                        errors[field] = 'Ce champ est vide ou contient une donnée invalide.';
                    }
                    else if(error.formErrors[field][0].rule == 'unique') {
                        errors[field] = 'Il existe déjà un autre type de fût avec cette valeur.';
                    }
                    else if(error.formErrors[field][0].rule == 'required') {
                        errors[field] = 'Ce champ est obligatoire.';
                    }
                    else {
                        errors[field] = error.formErrors[field][0].message;
                        console.warn('Validation message not translated. ', error.formErrors[field]);
                    }
                }
            }
            this.setState({ errors: errors });

            if(!Object.keys(errors).length) {
                NotificationActions.error('Une erreur s\'est produite pendant la création du type de fût', error);
            }
        });
    }


    /**
     * Call the service to delete this element.
     * In case of success, close the update dialog
     */
    _handleDelete() {
        // Submit
        BarrelTypeService.destroy(this.state.type.id)
        .then(() => {
            NotificationActions.snackbar('Les fûts ont bien été supprimés.');
            this.setState({showDeleteDialog: false});
            this.props.close();
        })
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant la supression des fûts', error);
        });
    }


    render() {

        const actions = [
            <FlatButton
                label="Supprimer"
                secondary={true}
                onTouchTap={() => this.setState({showDeleteDialog: true})}
                className="Dialog__DeleteButon"
            />,
            <FlatButton
                label="Fermer"
                secondary={true}
                onTouchTap={this.props.close}
            />,
            <FlatButton
                label="Modifier"
                primary={true}
                type="submit"
                onTouchTap={this._handleSubmit}
            />,
        ];

        return (

            <Dialog
                title={'Modification des fûts ' + this.state.values.name}
                open={this.props.show}
                actions={actions}
                autoScrollBodyContent={true}
                modal={false}
                onRequestClose={this.props.close}
            >

                Modifier le formulaire ci-dessous pour modifier les fûts <strong>{this.state.values.name}</strong>.


                <form onSubmit={this._handleSubmit}>
                    <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>
                    <Row>
                        <Col xs={12} sm={6}>
                            <TextField
                                floatingLabelText="Nom"
                                errorText={this.state.errors.name}
                                value={this.state.values.name}
                                fullWidth={true}
                                onChange={e => this._handleFieldChange('name', e.target.value)}
                                autoFocus={true}
                                ref={(field) => { this.focusField = field; }}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <TextField
                                floatingLabelText="Abréviation"
                                maxLength="3"
                                errorText={this.state.errors.shortName}
                                value={this.state.values.shortName}
                                fullWidth={true}
                                onChange={e => this._handleFieldChange('shortName', e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                        <TextField
                            floatingLabelText="Prix fournisseur d'un fût (€)"
                            errorText={this.state.errors.supplierPrice}
                            value={this.state.values.supplierPrice}
                            fullWidth={true}
                            onChange={e => this._handleFieldChange('supplierPrice', e.target.value)}
                        />
                        </Col>
                        <Col xs={12} sm={6}>
                            <TextField
                                floatingLabelText="Prix de revente d'un fût (€)"
                                errorText={this.state.errors.sellPrice}
                                value={this.state.values.sellPrice}
                                fullWidth={true}
                                onChange={e => this._handleFieldChange('sellPrice', e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <TextField
                                floatingLabelText="Nombre de litres par fût"
                                errorText={this.state.errors.liters}
                                value={this.state.values.liters}
                                fullWidth={true}
                                onChange={e => this._handleFieldChange('liters', e.target.value)}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <TextField
                                floatingLabelText="Nombre de fûts"
                                errorText={this.state.errors.count}
                                value={this.state.values.count}
                                fullWidth={true}
                                onChange={e => this._handleFieldChange('count', e.target.value)}
                            />
                        </Col>
                    </Row>
                </form>

                <Confirm
                    show={this.state.showReduceDialog}
                    no={() => this.setState({showReduceDialog: false})}
                    yes={() => this._handleSubmit(null, true)}
                >
                    Vous avez réduit le nombre de fûts. Ces fûts ainsi que toutes les informations associés à ces fûts (historique, état, position) seront supprimés.
                    Voulez-vous continuer ?
                </Confirm>

                <Confirm
                    show={this.state.showDeleteDialog}
                    no={() => this.setState({showDeleteDialog: false})}
                    yes={this._handleDelete}
                >
                    Voulez-vous vraiment supprimer le type de fût <strong>{this.state.values.name}</strong> ainsi que tout les fûts associés ?
                </Confirm>
            </Dialog>
        );
    }

}
