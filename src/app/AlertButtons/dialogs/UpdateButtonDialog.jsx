import React from "react";

import AlertButtonService from 'services/AlertButtonService';
import NotificationActions from 'actions/NotificationActions';
import TeamStore from 'stores/TeamStore';

import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import SelectableMenuItem from 'app/components/SelectableMenuItem.jsx';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import AutoComplete from 'app/components/AutoComplete.jsx';
import AlignedDialogActions from 'app/components/AlignedDialogActions.jsx';
import { DialogTitle, DialogContent } from 'material-ui/Dialog';

import Dialog from 'app/components/ResponsiveDialog.jsx';
import Confirm from 'app/components/Confirm.jsx';


/**
 * @param {array} categories List of existing categories
 * @param {array} teams List of receiving teams
 */
export default class UpdateButtonDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            values: {
                title: props.button.title || '',
                category: props.button.category || '',
                senderGroup: props.button.senderGroup || '-',
                receiverTeamId: props.button.receiverTeamId || '',
                messageRequired: props.button.messageRequired || false,
                messagePrompt: props.button.messagePrompt || '',
                messageDefault: props.button.messageDefault || '',
            },
            groups: TeamStore.groups,
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
                title: props.button.title || '',
                category: props.button.category || '',
                senderGroup: props.button.senderGroup || '-',
                receiverTeamId: props.button.receiverTeamId || '',
                messageRequired: props.button.messageRequired || false,
                messagePrompt: props.button.messagePrompt || '',
                messageDefault: props.button.messageDefault || '',
            },
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

        // Replace selects with '-' value by null
        let values = this.state.values;
        values.senderGroup = values.senderGroup === '-' ? null : values.senderGroup;

        // Submit
        AlertButtonService.update(this.props.button.id, values)
        .then((button) => {
            NotificationActions.snackbar('Le bouton ' + button.title + ' a bien été modifié.');
            if(this.focusField) this.focusField.focus();
            this.props.close();
        })
        .catch((error) => {
            if(error.formErrors && Object.keys(error.formErrors).length) {
                this.setState({ errors: error.formErrors });
            }
            else {
                NotificationActions.error('Une erreur s\'est produite pendant la modification du bouton', error);
            }
        });
    }

    /**
     * Call the model service to delete this item.
     * In case of success, close the update dialog (because the item doesn't exists anymore)
     */
    handleDelete() {
        // Submit
        AlertButtonService.destroy(this.props.button.id)
        .then(() => {
            NotificationActions.snackbar('Le bouton a bien été supprimé.');
            this.setState({showDeleteDialog: false});
            this.props.close();
        })
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant la supression du bouton', error);
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
            <Dialog
                open={this.props.show}
                onRequestClose={this.props.close}
            >
                <DialogTitle>Modification d'un bouton d'alerte</DialogTitle>
                <DialogContent>

                    <p>Remplissez le formulaire ci-dessous pour créer un nouveau bouton d'alerte.</p>

                    <form onSubmit={this.handleSubmit}>
                        <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nom de l'alerte"
                                    error={!!this.state.errors.title}
                                    helperText={this.state.errors.title}
                                    value={this.state.values.title}
                                    fullWidth
                                    onChange={e => this.handleFieldChange('title', e.target.value)}
                                    autoFocus={true}
                                    inputRef={(field) => { this.focusField = field; }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <AutoComplete
                                    label="Catégorie"
                                    error={!!this.state.errors.category}
                                    helperText={this.state.errors.category}
                                    value={this.state.values.category}
                                    fullWidth
                                    onChange={e => this.handleFieldChange('category', e.target.value)}
                                    onSuggestionSelected={option => this.handleFieldChange('category', option.label)}
                                    suggestions={this.props.categories.map(c => ({label: c}))}
                                    openOnFocus={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Groupe d'expéditeur de l'alerte"
                                    value={this.state.values.senderGroup}
                                    error={!!this.state.errors.senderGroup}
                                    helperText={this.state.errors.senderGroup}
                                    onChange={(e) => this.handleFieldChange('senderGroup', e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="-">Tous les groupes</MenuItem>
                                    {
                                        this.state.groups.map((group) => {
                                            return <MenuItem key={group} value={group}>{group}</MenuItem>
                                        })
                                    }
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    onChange={(e) => this.handleFieldChange('receiverTeamId', e.target.value)}
                                    value={this.state.values.receiverTeamId}
                                    error={!!this.state.errors.receiverTeamId}
                                    helperText={this.state.errors.receiverTeamId}
                                    fullWidth
                                    label="Destinataire de l'alerte"
                                >
                                    {
                                        this.props.teams.map((team) => {
                                            return <SelectableMenuItem key={team.id} value={team.id}>{team.name}</SelectableMenuItem>
                                        })
                                    }
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    multiline
                                    label="Question du message"
                                    fullWidth
                                    rows={3}
                                    rowsMax={3}
                                    value={this.state.values.messagePrompt}
                                    onChange={e => this.handleFieldChange('messagePrompt', e.target.value)}
                                />
                                <br/><br/>
                                <FormControlLabel
                                    label="Message obligatoire"
                                    control={
                                        <Switch
                                            checked={this.state.values.messageRequired}
                                            onChange={(e, v) => this.handleFieldChange('messageRequired', v)}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    multiline
                                    label="Réponse par défaut"
                                    fullWidth
                                    rows={3}
                                    rowsMax={3}
                                    value={this.state.values.messageDefault}
                                    onChange={e => this.handleFieldChange('messageDefault', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </form>
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
                        Annuler
                    </Button>
                    <Button
                        color="primary"
                        onTouchTap={this.handleSubmit}
                    >
                        Modifier
                    </Button>
                </AlignedDialogActions>
                <Confirm
                    show={this.state.showDeleteDialog}
                    no={() => this.setState({showDeleteDialog: false})}
                    yes={this.handleDelete}
                >
                    Voulez-vous vraiment supprimer le bouton d'alerte <strong>{this.state.values.title}</strong> ?
                </Confirm>
            </Dialog>
        )
    }
}
