import React from 'react';

import UserService from 'services/UserService';
import * as constants from 'config/constants';


import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui-old/Subheader';
import Grid from 'material-ui/Grid';
import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import Dialog from 'app/components/ResponsiveDialog.jsx';
import AlignedDialogActions from 'app/components/AlignedDialogActions.jsx';
import SelectGroupField from 'app/Teams/components/SelectGroupField.jsx';
import SelectRoleField from 'app/Teams/components/SelectRoleField.jsx';
import Confirm from 'app/components/Confirm.jsx';
import NotificationActions from 'actions/NotificationActions';

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
        .then((user) => {
            NotificationActions.snackbar('L\'utilisateur ' + user.name + ' a bien été modifié.');
            if(this.focusField) this.focusField.focus();
            this.props.close();
        })
        .catch((error) => {
            if(error.formErrors && Object.keys(error.formErrors).length) {
                this.setState({ errors: error.formErrors });
            }
            else {
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
        return (
            <div>
                <Dialog
                    open={this.props.show}
                    onRequestClose={this.props.close}
                >
                    <DialogTitle>
                        {'Modification de l\'utilisateur ' + this.state.values.name}
                    </DialogTitle>
                    <DialogContent>
                        <p>
                            Vous pouvez modifier l'utilisateur <strong>{this.state.values.name}</strong> à l'aide du formulaire ci-dessous.
                        </p>

                        <form onSubmit={this._handleSubmit}>
                            <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>
                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Nom"
                                        error={!!this.state.errors.name}
                                        helperText={this.state.errors.name}
                                        value={this.state.values.name}
                                        fullWidth
                                        onChange={e => this._handleFieldChange('name', e.target.value)}
                                        inputRef={(field) => { this.focusField = field; }}
                                        autoFocus={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    { this.state.values.login ?
                                        <TextField
                                            label="Login EtuUTT"
                                            error={!!this.state.errors.login}
                                            helperText={this.state.errors.login}
                                            value={this.state.values.login}
                                            fullWidth
                                            onChange={e => this._handleFieldChange('login', e.target.value)}
                                            disabled={true}
                                        />
                                    :
                                        <TextField
                                            label="IP"
                                            error={!!this.state.errors.ip}
                                            helperText={this.state.errors.ip}
                                            value={this.state.values.ip}
                                            fullWidth
                                            onChange={e => this._handleFieldChange('ip', e.target.value)}
                                        />
                                    }
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Avatar</InputLabel>
                                    <a href="#" onTouchTap={this._handleAvatarClick}>
                                        <Avatar src={(constants.avatarBasePath + this.state.id + '?' + this.state.avatarRefreshTimestamp)} size={80} />
                                            <input
                                                ref={(field) => { this.avatarUploadField = field; }}
                                                type="file"
                                                style={{"display" : "none"}}
                                                onChange={this._handleAvatarSubmit}
                                            />
                                    </a>
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
                            onTouchTap={this._handleSubmit}
                        >
                            Modifier
                        </Button>
                    </AlignedDialogActions>
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
