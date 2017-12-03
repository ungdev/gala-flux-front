import React from "react";

import AlertButtonService from 'services/AlertButtonService';
import NotificationActions from 'actions/NotificationActions';
import TeamStore from 'stores/TeamStore';

import { Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import SelectableMenuItem from 'app/components/SelectableMenuItem.jsx';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';
import AutoComplete from 'material-ui-old/AutoComplete';
import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';

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
                senderGroup: props.button.senderGroup || null,
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
        this._handleFieldChange = this._handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            values: {
                title: props.button.title || '',
                category: props.button.category || '',
                senderGroup: props.button.senderGroup || null,
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
    _handleFieldChange(field, value) {
        let values = this.state.values;
        values[field] = value;
        this.setState({values: values, errors: {}});
    }

    /**
     * Call the Team Service to update the team
     *
     * @param {Event} e Event like form submit that will be stopped
     */
    _handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }
        // Submit
        AlertButtonService.update(this.props.button.id, this.state.values)
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
    _handleDelete() {
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
    _setTeamAttribute(attr, v) {
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

                    Remplissez le formulaire ci-dessous pour créer un nouveau bouton d'alerte.

                    <form onSubmit={this._handleSubmit}>
                        <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>
                        <Row>
                            <Col xs={12} sm={6}>
                                <TextField
                                    label="Nom de l'alerte"
                                    error={!!this.state.errors.title}
                                    helperText={this.state.errors.title}
                                    value={this.state.values.title}
                                    fullWidth
                                    onChange={e => this._handleFieldChange('title', e.target.value)}
                                    autoFocus={true}
                                    inputRef={(field) => { this.focusField = field; }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <AutoComplete
                                    label="Catégorie"
                                    error={!!this.state.errors.category}
                                    helperText={this.state.errors.category}
                                    value={this.state.values.category}
                                    fullWidth
                                    onUpdateInput={v => this._handleFieldChange('category', v)}
                                    filter={AutoComplete.fuzzyFilter}
                                    dataSource={this.props.categories}
                                    openOnFocus={true}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6}>
                                <SelectField
                                    onChange={(e, i, v) => this._handleFieldChange("senderGroup", v)}
                                    value={this.state.values.senderGroup}
                                    error={!!this.state.errors.senderGroup}
                                    helperText={this.state.errors.senderGroup}
                                    fullWidth
                                    label="Groupe d'expéditeur de l'alerte"
                                    floatingLabelFixed={true}
                                >
                                    <MenuItem value={null} primaryText="Tous les groupes" />
                                    {
                                        this.state.groups.map((group, i) => {
                                            return <MenuItem key={i} value={group} primaryText={group} />
                                        })
                                    }
                                </SelectField>
                            </Col>
                            <Col xs={12} sm={6}>
                                <TextField
                                    select
                                    onChange={(e, i, v) => this._handleFieldChange("receiverTeamId", v)}
                                    value={this.state.values.receiverTeamId}
                                    error={!!this.state.errors.receiverTeamId}
                                    helperText={this.state.errors.receiverTeamId}
                                    fullWidth
                                    label="Destinataire de l'alerte"
                                >
                                    {
                                        this.props.teams.map((team, i) => {
                                            return <SelectableMenuItem key={team.id} value={team.id}>{team.name}</SelectableMenuItem>
                                        })
                                    }
                                </TextField>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6}>
                                <TextField
                                    multiLine={true}
                                    label="Question du message"
                                    fullWidth
                                    rows={3}
                                    rowsMax={3}
                                    value={this.state.values.messagePrompt}
                                    onChange={e => this._handleFieldChange('messagePrompt', e.target.value)}
                                />
                                <br/><br/>
                                <FormControlLabel
                                    label="Message obligatoire"
                                    control={
                                        <Toggle
                                            labelPosition="right"
                                            checked={this.state.values.messageRequired}
                                            onChange={(e, v) => this._handleFieldChange('messageRequired', v)}
                                        />}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <TextField
                                    multiLine={true}
                                    label="Réponse par défaut"
                                    fullWidth
                                    rows={3}
                                    rowsMax={3}
                                    value={this.state.values.messageDefault}
                                    onChange={e => this._handleFieldChange('messageDefault', e.target.value)}
                                />
                            </Col>
                        </Row>
                    </form>

                    <Confirm
                        show={this.state.showDeleteDialog}
                        no={() => this.setState({showDeleteDialog: false})}
                        yes={this._handleDelete}
                    >
                        Voulez-vous vraiment supprimer le bouton d'alerte <strong>{this.state.values.title}</strong> ?
                    </Confirm>
                </DialogContent>
                <DialogActions>
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
                        onTouchTap={this._handleSubmit}
                    >
                        Modifier
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
