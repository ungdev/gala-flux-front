import React from 'react';

import AuthActions from '../../actions/AuthActions';
import UserStore from '../../stores/UserStore';
import TeamStore from '../../stores/TeamStore';
import NotificationActions from '../../actions/NotificationActions';

import FlatButton from 'material-ui/FlatButton';
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

        this.UserStoreToken = null;
        this.TeamStoreToken = null;

        // binding
        this._handleChange = this._handleChange.bind(this);
        this._submitForm= this._submitForm.bind(this);
        this._closeDialog= this._closeDialog.bind(this);
        this._setUsers = this._setUsers.bind(this);
    }

    componentDidMount() {
        // fill the stores
        UserStore.loadData(null)
            .then(data => {
                // ensure that last token doen't exist anymore.
                UserStore.unloadData(this.UserStoreToken);

                // save the component token
                this.UserStoreToken = data.token;
                // get distinct teams id and create objects with their id
                let teams = [...new Set(data.result.map(user => user.team))];
                for (let i in teams) {
                    teams[i] = {id: teams[i]};
                }


                return TeamStore.loadData(teams)
            })
            .then(data => {
                // ensure that last token doen't exist anymore.
                TeamStore.unloadData(this.TeamStoreToken);

                // save the component token
                this.TeamStoreToken = data.token;

                // focus
                if(this.textInput) {
                    this.textInput.focus();
                }
            })
            .catch(error => console.log("load users/team error", error));
        // listen the store change
        UserStore.addChangeListener(this._setUsers);
        TeamStore.addChangeListener(this._setUsers);
        // set component state
        this._setUsers();
    }

    componentWillUnmount() {
        // clear the stores
        UserStore.unloadData(this.UserStoreToken);
        TeamStore.unloadData(this.TeamStoreToken);
        // remove store listeners
        UserStore.removeChangeListener(this._setUsers);
        TeamStore.removeChangeListener(this._setUsers);
    }

    /**
     * Called on store update to update state
     */
    _setUsers() {
        let out = [];

        for (let user of UserStore.users) {
            let team = TeamStore.findById(user.team);
            out.push({
                text: user.name + ' : ' + (team ? team.name : undefined),
                value: user.id,
            });
        }

        this.setState({ users: out });
   }

    /**
     * Update input value change
     * @param {string} value
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
                            ref={(input) => { this.textInput = input; }}
                        />
                </Dialog>
            </div>
        );
    }

}
