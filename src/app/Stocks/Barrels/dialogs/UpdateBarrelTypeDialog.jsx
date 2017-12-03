import React from 'react';

import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import AlignedDialogActions from 'app/components/AlignedDialogActions.jsx';
import Dialog from 'app/components/ResponsiveDialog.jsx';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';

import BarrelTypeService from 'services/BarrelTypeService';
import NotificationActions from 'actions/NotificationActions';
import Confirm from 'app/components/Confirm.jsx';


/**
 * @param {BarrelType} type
 * @param {integer} count Current number of barrels in this type
 */
export default class UpdateBarrelTypeDialog extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            values: {
                'name': props.type.name || '',
                'shortName': props.type.shortName || '',
                'liters': props.type.liters || '',
                'sellPrice': props.type.sellPrice || '',
                'supplierPrice': props.type.supplierPrice || '',
                'count': props.count || 0,
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
                values: {
                    'name': props.type.name || '',
                    'shortName': props.type.shortName || '',
                    'liters': props.type.liters || '',
                    'sellPrice': props.type.sellPrice || '',
                    'supplierPrice': props.type.supplierPrice || '',
                    'count': props.count || 0,
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
        BarrelTypeService.update(this.props.type.id, this.state.values)
        .then((type) => {

            // Set the barrel number
            return BarrelTypeService.setBarrelCount(type.id, this.state.values.count);
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
            if(error.formErrors && Object.keys(error.formErrors).length) {
                this.setState({ errors: error.formErrors });
            }
            else {
                NotificationActions.error('Une erreur s\'est produite pendant la modification du type de fût', error);
            }
        });
    }


    /**
     * Call the service to delete this element.
     * In case of success, close the update dialog
     */
    _handleDelete() {
        // Submit
        BarrelTypeService.destroy(this.props.type.id)
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
        return (
            <Dialog
                open={this.props.show}
                onRequestClose={this.props.close}
            >
                <DialogTitle>{'Modification des fûts ' + this.state.values.name}</DialogTitle>
                <DialogContent>

                    <p>Modifier le formulaire ci-dessous pour modifier les fûts <strong>{this.state.values.name}</strong>.</p>


                    <form onSubmit={this._handleSubmit}>
                        <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nom"
                                    error={!!this.state.errors.name}
                                    helperText={this.state.errors.name}
                                    value={this.state.values.name}
                                    fullWidth
                                    onChange={e => this._handleFieldChange('name', e.target.value)}
                                    autoFocus={true}
                                    inputRef={(field) => { this.focusField = field; }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Abréviation"
                                    inputProps={{maxLength: 3}}
                                    error={!!this.state.errors.shortName}
                                    helperText={this.state.errors.shortName}
                                    value={this.state.values.shortName}
                                    fullWidth
                                    onChange={e => this._handleFieldChange('shortName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <TextField
                                label="Prix fournisseur d'un fût (€)"
                                error={!!this.state.errors.supplierPrice}
                                helperText={this.state.errors.supplierPrice}
                                value={this.state.values.supplierPrice}
                                fullWidth
                                onChange={e => this._handleFieldChange('supplierPrice', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Prix de revente d'un fût (€)"
                                    error={!!this.state.errors.sellPrice}
                                    helperText={this.state.errors.sellPrice}
                                    value={this.state.values.sellPrice}
                                    fullWidth
                                    onChange={e => this._handleFieldChange('sellPrice', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nombre de litres par fût"
                                    error={!!this.state.errors.liters}
                                    helperText={this.state.errors.liters}
                                    value={this.state.values.liters}
                                    fullWidth
                                    onChange={e => this._handleFieldChange('liters', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nombre de fûts"
                                    error={!!this.state.errors.count}
                                    helperText={this.state.errors.count}
                                    value={this.state.values.count}
                                    fullWidth
                                    onChange={e => this._handleFieldChange('count', e.target.value)}
                                />
                            </Grid>
                        </Grid>
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
                </DialogContent>
                <AlignedDialogActions>
                    <Button
                        color="accent"
                        onTouchTap={() => this.setState({showDeleteDialog: true})}
                        className="Dialog__DeleteButon"
                    >
                        Supprimer
                    </Button>
                    <Button
                        color="accent"
                        onTouchTap={this.props.close}
                    >
                        Fermer
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        onTouchTap={this._handleSubmit}
                    >
                        Modifier
                    </Button>
                </AlignedDialogActions>
            </Dialog>
        );
    }

}
