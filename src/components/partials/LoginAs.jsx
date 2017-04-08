import React from 'react';

import AuthActions from '../../actions/AuthActions';
import UserStore from '../../stores/UserStore';
import TeamStore from '../../stores/TeamStore';
import NotificationActions from '../../actions/NotificationActions';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';

export default class LoginAs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            users: [],
            error: '',
        };

        // binding
        this._handleChange = this._handleChange.bind(this);
        this._submitForm= this._submitForm.bind(this);
        this._closeDialog= this._closeDialog.bind(this);
        this._onStoreChange= this._onStoreChange.bind(this);
    }

    componentDidMount() {
        // listen the store change
        UserStore.addChangeListener(this._onStoreChange);
        TeamStore.addChangeListener(this._onStoreChange);
        this._onStoreChange();
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onStoreChange);
        TeamStore.removeChangeListener(this._onStoreChange);
    }

    /**
     * Called on store update to update state
     */
    _onStoreChange() {
        let out = [];
        for (var index in UserStore.users) {
            let team = TeamStore.findOne({id: UserStore.users[index].team});
            out.push({
                text: UserStore.users[index].name + ' : ' + (team?team.name:undefined),
                value: UserStore.users[index].id,
            });
        }
        this.setState({ users: out });
   }

    /**
     * Update input value change
     * @param e
     */
    _handleChange(value) {
        this.setState({ value: value });
    }

    /**
     * Submit the login as form
     */
    _submitForm(item) {
        AuthActions.loginAs(item.value)
        .then(() => {
            this._closeDialog();
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
    _closeDialog() {
        this.setState({ id: '', error: '' });
        this.props.closeDialog();
    }

    render() {
        const actions = [
            <FlatButton
                label="Annuler"
                primary={true}
                onTouchTap={this._closeDialog}
                />,
        ];

        return (
            <div>
                <Dialog
                    title="Se connecter en tant que ..."
                    actions={actions}
                    modal={false}
                    open={this.props.open}
                    onRequestClose={this._closeDialog}
                    >
                        <AutoComplete
                            floatingLabelText="Nom de l'utilisateur"
                            searchText={this.state.value}
                            onUpdateInput={this._handleChange}
                            dataSource={this.state.users}
                            filter={AutoComplete.caseInsensitiveFilter}
                            errorText={this.state.error}
                            onNewRequest={this._submitForm}
                            maxSearchResults={10}
                        />
                </Dialog>
            </div>
        );
    }

}
