import React from 'react';

import Button from 'material-ui/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

export default class LoginAs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: ''
        };

        // binding
        this._handleChange = this._handleChange.bind(this);
        this._submitForm= this._submitForm.bind(this);
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
        this.props.closeDialog();
        this.setState({ id: '' });
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.closeDialog}
            >
                <DialogTitle>Login as</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Enter the user ID"
                        onChange={this._handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.closeDialog} primary>Cancel</Button>
                    <Button onClick={this._submitForm} primary>Login</Button>
                </DialogActions>
            </Dialog>
        );
    }

}