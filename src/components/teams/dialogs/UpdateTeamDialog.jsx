import React from 'react';

import TeamService from 'services/TeamService';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';

import SelectGroupField from 'components/teams/partials/SelectGroupField.jsx';
import SelectRoleField from 'components/teams/partials/SelectRoleField.jsx';
import Confirm from 'components/partials/Confirm.jsx';
import Dialog from 'components/partials/ResponsiveDialog.jsx';
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
        this._handleFieldChange = this._handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
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
    _handleDelete() {
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
