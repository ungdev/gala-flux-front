import React from "react";

import AlertButtonService from '../../services/AlertButtonService';
import NotificationActions from '../../actions/NotificationActions';
import TeamStore from '../../stores/TeamStore';

import Dialog from 'material-ui/Dialog';
import { Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';



/**
 * @param {array} categories List of existing categories
 * @param {array} teams List of receiving teams
 */
export default class NewButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: props.categories,
            teams: props.teams,
            groups: TeamStore.groups,
            values: {
                title: '',
                category: '',
                senderGroup: null,
                receiver: '',
                messageRequired: false,
                messagePrompt: 'Avez-vous des informations complémentaires ?',
            },
            errors: {},
        };


        // binding
        this._handleFieldChange = this._handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            categories: props.categories,
            teams: props.teams,
            groups: TeamStore.groups,
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
                receiver: '',
                messageRequired: false,
                messagePrompt: 'Avez-vous des informations complémentaires ?',
            } });
            NotificationActions.snackbar('Le bouton ' + button.title + ' a bien été créé.');
            this.focusField.focus();
        })
        .catch((error) => {
            let errors = error.userFormErrors;
            this.setState({ errors: errors });

            if(!Object.keys(errors).length) {
                NotificationActions.error('Une erreur s\'est produite pendant la création du bouton', error);
            }
        });
    }



    render() {
        const actions = [
            <FlatButton
                label="Fermer"
                secondary={true}
                onTouchTap={this.props.close}
            />,
            <FlatButton
                label="Créer"
                primary={true}
                type="submit"
                onTouchTap={this._handleSubmit}
            />,
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
                                floatingLabelText="Nom de l'alerte"
                                errorText={this.state.errors.title}
                                value={this.state.values.title}
                                fullWidth={true}
                                onChange={e => this._handleFieldChange('title', e.target.value)}
                                autoFocus={true}
                                ref={(field) => { this.focusField = field; }}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <AutoComplete
                                floatingLabelText="Catégorie"
                                errorText={this.state.errors.category}
                                value={this.state.values.category}
                                fullWidth={true}
                                onUpdateInput={v => this._handleFieldChange('category', v)}
                                filter={AutoComplete.fuzzyFilter}
                                dataSource={this.state.categories}
                                openOnFocus={true}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <SelectField
                                onChange={(e, i, v) => this._handleFieldChange("senderGroup", v)}
                                value={this.state.values.senderGroup}
                                errorText={this.state.errors.senderGroup}
                                fullWidth={true}
                                floatingLabelText="Groupe d'expéditeur de l'alerte"
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
                            <SelectField
                                onChange={(e, i, v) => this._handleFieldChange("receiver", v)}
                                value={this.state.values.receiver}
                                errorText={this.state.errors.receiver}
                                fullWidth={true}
                                floatingLabelText="Destinataire de l'alerte"
                            >
                                {
                                    this.state.teams.map((team, i) => {
                                        return <MenuItem key={i} value={team.id} primaryText={team.name} />
                                    })
                                }
                            </SelectField>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <TextField
                                multiLine={true}
                                floatingLabelText="Question du message"
                                fullWidth={true}
                                value={this.state.values.messagePrompt}
                                onChange={e => this._handleFieldChange('messagePrompt', e.target.value)}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <br/><br/>
                            <Toggle
                                label="Message obligatoire"
                                labelPosition="right"
                                toggled={this.state.values.messageRequired}
                                onToggle={(e, v) => this._handleFieldChange('messageRequired', v)}
                            />
                        </Col>
                    </Row>
                </form>
            </Dialog>
        )
    }
}
