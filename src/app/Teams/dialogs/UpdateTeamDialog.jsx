import React from 'react';

import TeamService from 'services/TeamService';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import { DialogTitle, DialogContent } from 'material-ui/Dialog';

import Dialog from 'app/components/ResponsiveDialog.jsx';
import AlignedDialogActions from 'app/components/AlignedDialogActions.jsx';
import SelectGroupField from 'app/Teams/components/SelectGroupField.jsx';
import SelectRoleField from 'app/Teams/components/SelectRoleField.jsx';
import Confirm from 'app/components/Confirm.jsx';
import NotificationActions from 'actions/NotificationActions';

export default class UpdateTeamDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            values: {
                'name': props.team.name || '',
                'role': props.team.role || '',
                'group': props.team.group || '',
                'location': props.team.location || '',
            },
            errors: {},
            showDeleteDialog: false,
        };


        // binding
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            values: {
                'name': props.team.name || '',
                'role': props.team.role || '',
                'group': props.team.group || '',
                'location': props.team.location || '',
            }
        });
    }

    /**
     * Called on field change
     *
     * @param  {string} field Field name
     * @param  {string} value New value
     */
    handleFieldChange(field, value) {
        let values = this.state.values;
        values[field] = value;
        this.setState({values: values, errors: {}});
    }

    /**
     * Call the Team Service to update the team
     *
     * @param {Event} e Event like form submit that will be stopped
     */
    handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }

        // Submit
        TeamService.update(this.props.team.id, this.state.values)
        .then((team) => {
            NotificationActions.snackbar('L\'équipe ' + team.name + ' a bien été modifié.');
            if(this.focusField) this.focusField.focus();
            this.props.close();
        })
        .catch((error) => {
            if(error.formErrors && Object.keys(error.formErrors).length) {
                this.setState({ errors: error.formErrors });
            }
            else {
                NotificationActions.error('Une erreur s\'est produite pendant la modification de l\'équipe', error);
            }
        });
    }

    /**
     * Call the Team service to delete this Team.
     * In case of success, close the update dialog (because the team doesn't exists anymore)
     */
    handleDelete() {
        // Submit
        TeamService.destroy(this.props.team.id)
        .then(() => {
            NotificationActions.snackbar('L\'équipe a bien été supprimé.');
            this.props.close();
        })
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant la supression de l\'équipe', error);
        });
    }

    /**
     * Update an attribute of the team object in the component state
     *
     * @param {string} attr : the team attribute to update in the state
     * @param {string} v : the new attribute value
     */
    setTeamAttribute(attr, v) {
        const team = this.state.team;
        team[attr] = v;
        this.setState({team});
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.show}
                    onRequestClose={this.props.close}
                >
                    <DialogTitle>{'Modification de l\'équipe ' + this.state.values.name}</DialogTitle>
                    <DialogContent>

                        Vous pouvez modifier l'équipe <strong>{this.state.values.name}</strong> à l'aide du formulaire ci-dessous.
                        <p>Pour créer un nouveau groupe de discussion, il suffit de choisir un nom qui n'est pas dans la liste proposé.</p>

                        <form onSubmit={this.handleSubmit}>
                            <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>
                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Nom"
                                        error={!!this.state.errors.name}
                                        helperText={this.state.errors.name}
                                        value={this.state.values.name}
                                        fullWidth
                                        onChange={e => this.handleFieldChange('name', e.target.value)}
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
                                        onChange={e => this.handleFieldChange('location', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SelectRoleField
                                        label="Autorisations"
                                        error={!!this.state.errors.role}
                                        helperText={this.state.errors.role}
                                        value={this.state.values.role}
                                        fullWidth
                                        onChange={e => this.handleFieldChange('role', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SelectGroupField
                                        label="Groupe de discussion"
                                        error={!!this.state.errors.group}
                                        helperText={this.state.errors.group}
                                        value={this.state.values.group}
                                        fullWidth
                                        onChange={e => this.handleFieldChange('group', e.target.value)}
                                        onSuggestionSelected={option => this.handleFieldChange('group', option.label)}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                    <AlignedDialogActions>
                        <Button
                            color="accent"
                            onTouchTap={() => this.setState({showDeleteDialog: true})}
                        >
                            Supprimer
                        </Button>
                        <Button
                            color="accent"
                            onTouchTap={this.props.close}
                        >
                            Annuler
                        </Button>
                        <Button
                            color="primary"
                            onTouchTap={this.handleSubmit}
                        >
                            Modifier
                        </Button>
                    </AlignedDialogActions>
                </Dialog>

                <Confirm
                    show={this.state.showDeleteDialog}
                    no={() => this.setState({showDeleteDialog: false})}
                    yes={this.handleDelete}
                >
                    Voulez-vous vraiment supprimer l'équipe <strong>{this.state.values.name}</strong> ?<br/>
                    Tous les utilisateurs associés à cette équipe seront supprimés.
                </Confirm>
            </div>
        );
    }

}
