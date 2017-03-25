import React from 'react';

import AuthService from '../../services/AuthService';

import Button from 'material-ui/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

export default class LoginAs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            error: ''
        };

        // binding
        this._handleChange = this._handleChange.bind(this);
        this._submitForm= this._submitForm.bind(this);
        this._closeDialog= this._closeDialog.bind(this);
    }

    /**
     * Update the id in the component state
     * @param e
     */
    _handleChange(e) {
        this.setState({ id: e.target.value });
    }

    /**
     * Submit the login as form
     */
    _submitForm() {
        AuthService.tryToLoginAs(this.state.id,
            err => {
                if (err) {
                    this.setState({ error: err.body[0]._error.message });
                } else {
                    this._closeDialog();
                }
            }
        );
    }

    /**
     * Reset the state of the LoginAs component and
     * call the closeDialog method of his parent to hide the Dialog
     */
    _closeDialog() {
        this.props.closeDialog();
        this.setState({ id: '', error: '' });
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this._closeDialog}
            >
                <DialogTitle>Login as</DialogTitle>
                <DialogContent>
                    {
                        this.state.error
                            ?
                                <TextField
                                    error
                                    label={this.state.error}
                                    onChange={this._handleChange}
                                />
                            :
                                <TextField
                                    label="Enter the user ID"
                                    onChange={this._handleChange}
                                />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.closeDialog} primary>Cancel</Button>
                    <Button onClick={this._submitForm} primary>Login</Button>
                </DialogActions>
            </Dialog>
        );
    }

}