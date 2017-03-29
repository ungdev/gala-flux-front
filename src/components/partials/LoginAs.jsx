import React from 'react';

import AuthService from '../../services/AuthService';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

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
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this._closeDialog}
                />,
            <FlatButton
                label="Login"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this._submitForm}
                />,
        ];

        return (
            <div>
                <Dialog
                    title="Login as"
                    actions={actions}
                    modal={false}
                    open={this.props.open}
                    onRequestClose={this._closeDialog}
                    >
                    {
                        this.state.error
                            ?
                                <TextField
                                    hintText="Enter the user ID"
                                    onChange={this._handleChange}
                                    errorText={this.state.error}
                                />
                            :
                                <TextField
                                    hintText="Enter the user ID"
                                    onChange={this._handleChange}
                                />
                    }
                </Dialog>
            </div>
        );
    }

}
