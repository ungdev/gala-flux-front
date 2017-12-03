import React from "react";

import AlertButtonService from 'services/AlertButtonService';
import NotificationActions from 'actions/NotificationActions';
import TeamStore from 'stores/TeamStore';

import Dialog from 'app/components/ResponsiveDialog.jsx';
import { Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import SelectableMenuItem from 'app/components/SelectableMenuItem.jsx';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';
import AutoComplete from 'material-ui-old/AutoComplete';



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
                senderGroup: null,
                receiverTeamId: '',
                messageRequired: false,
                messagePrompt: 'Quel est le problème ?',
                messageDefault: '',
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
     * Call the Service to create a new button
     *
     * @param {Event} e Event like form submit that will be stopped
     */
    _handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }

        // Submit
        AlertButtonService.create(this.state.values)
        .then((button) => {
            this.setState({ values: {
                title: '',
                category: '',
                senderGroup: null,
                receiverTeamId: '',
                messageRequired: false,
                messagePrompt: 'Quel est le problème ?',
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
        const actions = [
            <Button
                color="accent"
                onTouchTap={this.props.close}
            >
                Fermer
            </Button>,
            <Button
                color="primary"
                type="submit"
                onTouchTap={this._handleSubmit}
            >
                Créer
            </Button>,
        ];


        return (
            <Dialog
                title={'Creation d\'un bouton d\'alerte'}
                open={this.props.show}
                actions={actions}
                autoScrollBodyContent={true}
                modal={false}
                onRequestClose={this.props.close}
            >

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
                                autoFocus
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
                            <TextField
                                select
                                label="Groupe d'expéditeur de l'alerte"
                                value={this.state.values.senderGroup}
                                onChange={(e) => this.props.setFilters('senderGroup', e.target.value)}
                                fullWidth
                            >
                                <SelectableMenuItem value={null}>Tous les groupes</SelectableMenuItem>
                                {
                                    this.state.groups.map((group, i) => {
                                        return <SelectableMenuItem key={group} value={group} >{group}</SelectableMenuItem>
                                    })
                                }
                            </TextField>
                        </Col>
                        <Col xs={12} sm={6}>
                            <SelectField
                                onChange={(e, i, v) => this._handleFieldChange("receiverTeamId", v)}
                                value={this.state.values.receiverTeamId}
                                error={!!this.state.errors.receiverTeamId}
                                helperText={this.state.errors.receiverTeamId}
                                fullWidth
                                label="Destinataire de l'alerte"
                            >
                                {
                                    this.props.teams.map((team, i) => {
                                        return <MenuItem key={i} value={team.id} primaryText={team.name} />
                                    })
                                }
                            </SelectField>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <TextField
                                multiLine
                                label="Question du message"
                                fullWidth
                                rows={3}
                                rowsMax={3}
                                value={this.state.values.messagePrompt}
                                onChange={e => this._handleFieldChange('messagePrompt', e.target.value)}
                            />
                            <FormControlLabel
                                label="Message obligatoire"
                                control={
                                    <Switch
                                        labelPosition="right"
                                        checked={this.state.values.messageRequired}
                                        onChange={(e, v) => this._handleFieldChange('messageRequired', v)}
                                    />
                                }
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <TextField
                                multiLine
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
            </Dialog>
        )
    }
}
