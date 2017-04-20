import React from 'react';

import UserService from '../../../services/UserService';
import * as constants from '../../../config/constants';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import { Row, Col } from 'react-flexbox-grid';

import Confirm from '../../partials/Confirm.jsx';
import NotificationActions from '../../../actions/NotificationActions';

export default class UpdateMemberDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: (props.member ? props.member.id : null),
            values: {
                'login': (props.member ? props.member.login : ''),
                'ip': (props.member ? props.member.ip : ''),
                'name': (props.member ? props.member.name : ''),
            },
            avatarRefreshTimestamp: '',
            errors: {},
            showDeleteDialog: false,
        };


        // binding
        this._handleFieldChange = this._handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleAvatarClick = this._handleAvatarClick.bind(this);
        this._handleAvatarSubmit = this._handleAvatarSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            id: (nextProps.member ? nextProps.member.id : null),
            values: {
                'login': (nextProps.member ? nextProps.member.login : this.state.values.login),
                'ip': (nextProps.member ? nextProps.member.ip : this.state.values.ip),
                'name': (nextProps.member ? nextProps.member.name : this.state.values.name),
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
     * Call the user Service to update the user
     *
     * @param {Event} e Event like form submit that will be stopped
     */
    _handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }

        // Submit
        UserService.update(this.state.id, this.state.values)
            .then(user => {
                NotificationActions.snackbar('L\'utilisateur ' + user.name + ' a bien été modifié.');
                this.focusField.focus();
                this.props.close();
            })
            .catch(error => {
                let errors = {};
                if(error.status === 'ValidationError' && error.formErrors) {
                    for (let field in error.formErrors) {
                        if(error.formErrors[field][0].rule == 'string') {
                            errors[field] = 'Ce champ est vide ou contient une valeur invalide.';
                        }
                        else if(error.formErrors[field][0].rule == 'unique') {
                            errors[field] = 'Il existe déjà un utilisateur avec cette valeur.';
                        }
                        else if(error.formErrors[field][0].rule == 'required') {
                            errors[field] = 'Ce champ ne peut pas être vide.';
                        }
                        else {
                            errors[field] = error.formErrors[field][0].message;
                            console.warn('Validation message not translated. ', error.formErrors[field]);
                        }
                    }
                }
                this.setState({ errors: errors });

                if(!Object.keys(errors).length) {
                    NotificationActions.error('Une erreur s\'est produite pendant la modification de l\'user', error);
                }
            });
    }

    /**
     * Call the User service to delete this User.
     * In case of success, close the update dialog (because the user doesn't exists anymore)
     */
    _handleDelete() {
        // Submit
        UserService.destroy(this.state.id)
        .then(() => {
            NotificationActions.snackbar('L\'utilisateur a bien été supprimé.');
            this.setState({showDeleteDialog: false});
            this.props.close();
        })
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant la supression de l\'utilisateur', error);
        });
    }

    /**
     * Pop a file submit window to update the avatar
     */
    _handleAvatarClick(e) {
        if(e) {
            e.preventDefault();
        }

        this.avatarUploadField.click();

        return false;
    }

    /**
     * Upload directly avatar on field change
     *
     * @param {Event} e Event like form submit that will be stopped
     */
    _handleAvatarSubmit(e) {
        if(e) {
            e.preventDefault();
        }

        if(this.avatarUploadField.files && this.avatarUploadField.files[0]) {
            var reader = new FileReader();

            reader.onload = (event) => {
                let img = new Blob([event.target.result], {type: this.avatarUploadField.files[0].type});
                UserService.uploadAvatar(this.state.id, img)
                .then((avatar) => {
                    NotificationActions.snackbar('L\'avatar de ' + this.state.values.name + ' a bien été modifié.');
                    this.setState({ avatarRefreshTimestamp: new Date().getTime()})
                })
                .catch((error) => {
                    NotificationActions.error('Une erreur s\'est produite pendant la modification de l\'avatar', error);
                });
            }

            reader.onerror = (error) => {
                NotificationActions.error('Une erreur s\'est produite pendant la lecture de l\'avatar', error);
            };

            reader.readAsArrayBuffer(this.avatarUploadField.files[0]);
        }
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
                    title={'Modification de l\'utilisateur ' + this.state.values.name}
                    open={this.props.show}
                    actions={actions}
                    autoScrollBodyContent={true}
                    modal={false}
                    onRequestClose={this.props.close}
                >

                    Vous pouvez modifier l'utilisateur <strong>{this.state.values.name}</strong> à l'aide du formulaire ci-dessous.

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
                                    ref={(field) => { this.focusField = field; }}
                                    autoFocus={true}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                { this.state.values.login ?
                                    <TextField
                                        floatingLabelText="Login EtuUTT"
                                        errorText={this.state.errors.login}
                                        value={this.state.values.login}
                                        fullWidth={true}
                                        onChange={e => this._handleFieldChange('login', e.target.value)}
                                        disabled={true}
                                    />
                                :
                                    <TextField
                                        floatingLabelText="IP"
                                        errorText={this.state.errors.ip}
                                        value={this.state.values.ip}
                                        fullWidth={true}
                                        onChange={e => this._handleFieldChange('ip', e.target.value)}
                                    />
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6}>
                                <label className="FieldLabel">Avatar</label>
                                <a href="#" onTouchTap={this._handleAvatarClick}>
                                    <Avatar src={(constants.avatarBasePath + this.state.id + '?' + this.state.avatarRefreshTimestamp)} backgroundColor="white" size={80} />
                                        <input
                                            ref={(field) => { this.avatarUploadField = field; }}
                                            type="file"
                                            style={{"display" : "none"}}
                                            onChange={this._handleAvatarSubmit}
                                        />
                                </a>
                                <br/>
                            </Col>
                            <Col xs={12} sm={6}>
                            </Col>
                        </Row>
                    </form>
                </Dialog>

                <Confirm
                    show={this.state.showDeleteDialog}
                    no={() => this.setState({showDeleteDialog: false})}
                    yes={this._handleDelete}
                >
                    Voulez-vous vraiment supprimer l'utilisateur <strong>{this.state.values.name}</strong> ?
                </Confirm>
            </div>
        );
    }

}
