import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';

import SelectGroupField from '../partials/SelectGroupField.jsx';
import SelectRoleField from '../partials/SelectRoleField.jsx';

import TeamService from '../../../services/TeamService';
import NotificationActions from '../../../actions/NotificationActions';

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
        TeamService.createTeam(this.state.values)
            .then(team => {
                this.setState({ values: {
                    name: '',
                    role: '',
                    group: '',
                    location: '',
                } });
                NotificationActions.snackbar('L\'équipe ' + team.name + ' a bien été créé.');
                this.focusField.focus();
            })
            .catch(error => {
                let errors = {};
                if(error.status === 'UnknownRole') {
                    errors.role = 'Ce champ est vide ou contient une invalide.';
                }
                else if(error.status === 'ValidationError' && error.formErrors) {
                    for (let field in error.formErrors) {
                        if(error.formErrors[field][0].rule == 'string') {
                            errors[field] = 'Ce champ est vide ou contient une invalide.';
                        }
                        else if(error.formErrors[field][0].rule == 'unique') {
                            errors[field] = 'Il existe déjà une équipe avec cette valeur.';
                        }
                        else {
                            errors[field] = error.formErrors[field][0].message;
                            console.warn('Validation message not translated. ', error.formErrors[field]);
                        }
                    }
                }
                this.setState({ errors: errors });

                if(!Object.keys(errors).length) {
                    NotificationActions.error('Une erreur s\'est produite pendant la création de l\'équipe', error);
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
                title={'Création d\'une équipe'}
                open={this.props.show}
                actions={actions}
                autoScrollBodyContent={true}
                modal={false}
                onRequestClose={this.props.close}
            >

                Remplissez le formulaire ci-dessous pour créer une nouvelle équipe.
                <p>Pour créer un nouveau groupe de discussion, il suffit de choisir un nom qui n'est pas dans la liste proposé.</p>


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
                                floatingLabelText="Emplacement"
                                errorText={this.state.errors.location}
                                value={this.state.values.location}
                                fullWidth={true}
                                onChange={e => this._handleFieldChange('location', e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <SelectRoleField
                                errorText={this.state.errors.role}
                                selected={this.state.values.role}
                                fullWidth={true}
                                onChange={value => this._handleFieldChange('role', value)}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <SelectGroupField
                                errorText={this.state.errors.group}
                                value={this.state.values.group}
                                fullWidth={true}
                                onChange={value => this._handleFieldChange('group', value)}
                                onSubmit={this._handleSubmit}
                            />
                        </Col>
                    </Row>
                </form>
            </Dialog>
        );
    }

}
