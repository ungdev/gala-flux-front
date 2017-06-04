import React from 'react';

import AuthActions from 'actions/AuthActions';
import UserStore from 'stores/UserStore';
import TeamStore from 'stores/TeamStore';
import NotificationActions from 'actions/NotificationActions';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'components/partials/ResponsiveDialog.jsx';
import AutoComplete from 'material-ui/AutoComplete';
import DataLoader from 'components/partials/DataLoader.jsx';

export default class LoginAs extends React.Component {

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
        AuthActions.loginAs(item.value)
        .then(() => {
            location.href = '/';
            this.closeDialog();
        })
        .catch((error) => {
            switch(error.status) {
                case 'IdNotFound':
                    this.setState({ error: 'Cet utilisateur n\'existe pas' });
                    break;
                case 'forbidden':
                    this.setState({ error: 'Vous n\'avez pas le droit d\'utiliser cette fonctionnalité' });
                    break;
                default:
                    NotificationActions.error('Une erreur inattendu s\'est produite pendant la tentative de connexion "en tant que".', error)
            }
        });
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
        const actions = [
            <FlatButton
                label="Annuler"
                primary={true}
                onTouchTap={this.closeDialog}
                />,
        ];

        return (
            <DataLoader
                filters={new Map([
                    ['Team', null],
                    ['User', null],
                ])}
                onChange={ datastore => this.setState({
                    users: datastore.User.map(user => ({ value: user.id, text: user.name + ' : ' + datastore.Team.get(user.teamId).name})),
                })}
            >
                { () => (
                    <div>
                        <Dialog
                            title="Se connecter en tant que ..."
                            actions={actions}
                            modal={false}
                            open={this.props.open}
                            onRequestClose={this.closeDialog}
                            >
                                <AutoComplete
                                    floatingLabelText="Nom de l'utilisateur"
                                    searchText={this.state.value}
                                    onUpdateInput={this.handleChange}
                                    dataSource={this.state.users}
                                    filter={AutoComplete.caseInsensitiveFilter}
                                    errorText={this.state.error}
                                    onNewRequest={this.submitForm}
                                    maxSearchResults={10}
                                    ref={(input) => { this.textInput = input; }}
                                />
                        </Dialog>
                    </div>
                )}
            </DataLoader>
        );
    }

}
