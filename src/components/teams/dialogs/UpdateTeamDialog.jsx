import React from 'react';

import TeamService from '../../../services/TeamService';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';

import SelectGroupField from '../partials/SelectGroupField.jsx';
import SelectRoleField from '../partials/SelectRoleField.jsx';
import Confirm from '../../partials/Confirm.jsx';
import NotificationActions from '../../../actions/NotificationActions';

export default class UpdateTeamDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: (props.team ? props.team.id : null),
            values: {
                'name': (props.team ? props.team.name : ''),
                'role': (props.team ? props.team.role : ''),
                'group': (props.team ? props.team.group : ''),
                'location': (props.team ? props.team.location : ''),
            },
            errors: {},
            showDeleteDialog: false,
        };


        // binding
        this._handleFieldChange = this._handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            id: (nextProps.team ? nextProps.team.id : null),
            values: {
                'name': (nextProps.team ? nextProps.team.name : this.state.values.name),
                'role': (nextProps.team ? nextProps.team.role : this.state.values.role),
                'group': (nextProps.team ? nextProps.team.group : this.state.values.group),
                'location': (nextProps.team ? nextProps.team.location : this.state.values.location),
            }
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
        TeamService.updateTeam(this.state.id, this.state.values)
        .then((team) => {
            NotificationActions.snackbar('L\'équipe ' + team.name + ' a bien été modifié.');
            this.focusField.focus();
            this.props.close();
        })
        .catch((error) => {
            console.log('error', error)
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
                NotificationActions.error('Une erreur s\'est produite pendant la modification de l\'équipe', error);
            }
        });
    }

    /**
     * Call the Team service to delete this Team.
     * In case of success, close the update dialog (because the team doesn't exists anymore)
     */
    _handleDelete() {
        // Submit
        TeamService.deleteTeam(this.state.id)
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
    _setTeamAttribute(attr, v) {
        const team = this.state.team;
        team[attr] = v;
        this.setState({team});
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
                label="Annuler"
                secondary={true}
                onTouchTap={this.props.close}
            />,
            <FlatButton
                label="Modifier"
                primary={true}
                onTouchTap={this._handleSubmit}
            />,
        ];

        return (
            <div>
                <Dialog
                    title={'Modification de l\'équipe ' + this.state.values.name}
                    open={this.props.show}
                    actions={actions}
                    autoScrollBodyContent={true}
                    modal={false}
                    onRequestClose={this.props.close}
                >

                    Vous pouvez modifier l'équipe <strong>{this.state.values.name}</strong> à l'aide du formulaire ci-dessous.
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

                <Confirm
                    show={this.state.showDeleteDialog}
                    no={() => this.setState({showDeleteDialog: false})}
                    yes={this._handleDelete}
                >
                    Voulez-vous vraiment supprimer l'équipe <strong>{this.state.values.name}</strong> ?<br/>
                    Tous les utilisateurs associés à cette équipe seront supprimés.
                </Confirm>
            </div>
        );
    }

}
