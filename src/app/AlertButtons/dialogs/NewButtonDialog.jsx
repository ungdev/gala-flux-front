import React from "react";

import AlertButtonService from 'services/AlertButtonService';
import NotificationActions from 'actions/NotificationActions';
import TeamStore from 'stores/TeamStore';

import Dialog from 'app/components/ResponsiveDialog.jsx';
import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';
import AutoComplete from 'app/components/AutoComplete.jsx';



/**
 * @param {array} categories List of existing categories
 * @param {array} teams List of receiving teams
 */
export default class NewButtonDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            groups: TeamStore.groups,
            values: {
                title: '',
                category: '',
                senderGroup: '-',
                receiverTeamId: '',
                messageRequired: false,
                messagePrompt: '',
                messageDefault: '',
            },
            errors: {},
        };


        // binding
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
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
     * Call the Service to create a new button
     *
     * @param {Event} e Event like form submit that will be stopped
     */
    _handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }

        // Replace selects with '-' value by null
        let values = this.state.values;
        values.senderGroup = values.senderGroup === '-' ? null : values.senderGroup;

        // Submit
        AlertButtonService.create(values)
        .then((button) => {
            this.setState({ values: {
                title: '',
                category: '',
                senderGroup: '-',
                receiverTeamId: '',
                messageRequired: false,
                messagePrompt: '',
                messageDefault: '',
            } });
            NotificationActions.snackbar('Le bouton ' + button.title + ' a bien été créé.');
            if(this.focusField) this.focusField.focus();
        })
        .catch((error) => {
            if(error.formErrors && Object.keys(error.formErrors).length) {
                this.setState({ errors: error.formErrors });
            }
            else {
                NotificationActions.error('Une erreur s\'est produite pendant la création du bouton', error);
            }
        });
    }



    render() {
        return (
            <Dialog
                open={this.props.show}
                onRequestClose={this.props.close}
            >
                <DialogTitle>Creation d'un bouton d'alerte</DialogTitle>
                <DialogContent>

                    <p>Remplissez le formulaire ci-dessous pour créer un nouveau bouton d'alerte.</p>

                    <form onSubmit={this._handleSubmit}>
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
                                    autoFocus
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
                                            return <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
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
        )
    }
}
