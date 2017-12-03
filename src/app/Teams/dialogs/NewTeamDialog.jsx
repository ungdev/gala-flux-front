import React from 'react';

import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import Dialog from 'app/components/ResponsiveDialog.jsx';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';

import SelectGroupField from 'app/Teams/components/SelectGroupField.jsx';
import SelectRoleField from 'app/Teams/components/SelectRoleField.jsx';

import TeamService from 'services/TeamService';
import NotificationActions from 'actions/NotificationActions';

export default class NewTeamDialog extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            values: {
                'name': '',
                'role': '',
                'group': '',
                'location': '',
            },
            errors: {},
        };

        // binding
        this._handleFieldChange = this._handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
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
        this.setState({values: values, errors: {}});
    }

    /**
     * Call the Team Service to create a new team
     *
     * @param {Event} e Event like form submit that will be stopped
     */
    _handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }
        // Submit
        TeamService.create(this.state.values)
        .then((team) => {
            this.setState({ values: {
                name: '',
                role: '',
                group: '',
                location: '',
            } });
            NotificationActions.snackbar('L\'équipe ' + team.name + ' a bien été créé.');
            if(this.focusField) this.focusField.focus();
        })
        .catch((error) => {
            if(error.formErrors && Object.keys(error.formErrors).length) {
                this.setState({ errors: error.formErrors });
            }
            else {
                NotificationActions.error('Une erreur s\'est produite pendant la création de l\'équipe', error);
            }
        });
    }

    render() {
        return (
            <Dialog
                open={this.props.show}
                onRequestClose={this.props.close}
            >
                <DialogTitle>Création d'une équipe</DialogTitle>
                <DialogContent>

                    Remplissez le formulaire ci-dessous pour créer une nouvelle équipe.
                    <p>Pour créer un nouveau groupe de discussion, il suffit de choisir un nom qui n'est pas dans la liste proposé.</p>


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
                                    label="Emplacement"
                                    error={!!this.state.errors.location}
                                    helperText={this.state.errors.location}
                                    value={this.state.values.location}
                                    fullWidth
                                    onChange={e => this._handleFieldChange('location', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectRoleField
                                    label="Autorisations"
                                    error={!!this.state.errors.role}
                                    helperText={this.state.errors.role}
                                    value={this.state.values.role}
                                    fullWidth
                                    onChange={e => this._handleFieldChange('role', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectGroupField
                                    label="Groupe de discussion"
                                    error={!!this.state.errors.group}
                                    helperText={this.state.errors.group}
                                    value={this.state.values.group}
                                    fullWidth
                                    onChange={e => this._handleFieldChange('group', e.target.value)}
                                    onSuggestionSelected={option => this._handleFieldChange('group', option.label)}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
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
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}
