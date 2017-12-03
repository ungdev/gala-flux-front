import React from 'react';

import AuthActions from 'actions/AuthActions';
import UserStore from 'stores/UserStore';
import TeamStore from 'stores/TeamStore';
import NotificationActions from 'actions/NotificationActions';

import Button from 'material-ui/Button';
import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import Dialog from 'app/components/ResponsiveDialog.jsx';
import AutoComplete from 'app/components/AutoComplete.jsx';
import DataLoader from 'app/components/DataLoader.jsx';

export default class LoginAsDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            error: '',
            users: null,
        };

        // binding
        this.handleChange = this.handleChange.bind(this);
        this.submitForm= this.submitForm.bind(this);
        this.closeDialog= this.closeDialog.bind(this);
    }

    /**
     * Update input value change
     * @param {string} value
     */
    handleChange(value) {
        this.setState({ value: value });
    }

    /**
     * Submit the login as form
     */
    submitForm(item) {
        AuthActions.loginAs(item.id)
        this.closeDialog();
    }

    /**
     * Reset the state of the LoginAs component and
     * call the closeDialog method of his parent to hide the Dialog
     */
    closeDialog() {
        this.setState({ id: '', error: '' });
        this.props.closeDialog();
    }

    render() {
        return (
            <DataLoader
                filters={new Map([
                    ['Team', null],
                    ['User', null],
                ])}
                onChange={ datastore => this.setState({
                    users: datastore.User.map(user => ({ id: user.id, label: user.name + ' : ' + datastore.Team.get(user.teamId).name})),
                })}
            >
                { () => (
                    <div>
                        <Dialog
                            open={this.props.open}
                            onRequestClose={this.closeDialog}
                        >
                            <DialogTitle>Se connecter en tant que ...</DialogTitle>
                            <DialogContent>
                                <AutoComplete
                                    label="Nom de l'utilisateur"
                                    error={!!this.state.error}
                                    helperText={this.state.error}
                                    value={this.state.value}
                                    fullWidth
                                    onChange={e => this.handleChange(e.target.value)}
                                    onSuggestionSelected={this.submitForm}
                                    suggestions={this.state.users}
                                    maxSearchResults={10}
                                    inputRef={(input) => { this.textInput = input; }}
                                    autoFocus
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    color="primary"
                                    onTouchTap={this.closeDialog}
                                >
                                    Annuler
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                )}
            </DataLoader>
        );
    }

}
