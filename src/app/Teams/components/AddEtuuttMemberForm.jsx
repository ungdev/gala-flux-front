import React from 'react';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { DialogActions, DialogTitle, DialogContent } from 'material-ui/Dialog';

import SearchField from "app/components/SearchField.jsx";
import UserService from 'services/UserService';
import NotificationActions from 'actions/NotificationActions';

export default class AddEtuuttMemberForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: props.team,
            users: [],
            query: '',
            loading: false,
            error: '',
        };

        // binding
        this.handleSubmit = this.handleSubmit.bind(this);
        this._addToTeam = this._addToTeam.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ team: nextProps.team });
    }

    /**
     * Used for the start search ettuut user according to input
     * @param {string} value search value
     */
    handleSubmit(value) {
        if(!value) {
            this.setState({ error: 'Ce champ ne peut pas être vide..' });
        }
        else {
            this.setState({ loading: true, query: value, error: '' });
            UserService.findEtuuttUser(value)
            .then((users) => {
                if(Array.isArray(users) && users.length >= 1) {
                    this.setState({ loading: false, users: users, error: '' });
                }
                else {
                    this.setState({ loading: false, users: [], error: 'Aucun utilisateur EtuUTT trouvé..' });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                if(error.status == 'NotEtuuttUser') {
                    this.setState({ error: 'Seul les comptes EtuUTT peuvent ajouter des membres via EtuUTT'});
                }
                else {
                    NotificationActions.error('Une erreur s\'est produite lors de la recherche de compte EtuUTT', error);
                }
            });
        }
    }

    /**
     * Call the UserService to create user
     *
     * @param {Object} user EtuUTT user object
     */
    _addToTeam(user) {
        let createdUser = null;
        let avatarUri = user.avatar;
        UserService.create({
            teamId: this.state.team.id,
            login: user.login,
            name: user.name,
        })
        .then(user => {
            createdUser = user;
            console.log('Created, download PNG')
            return UserService.downloadPngFromURI(avatarUri);
        })
        .then(blob => {
            console.log('Upload PNG')
            return UserService.uploadAvatar(createdUser.id, blob);
        })
        .then(_ => {
            console.log('Done')
            this.setState({ query: '', users: [] });
            NotificationActions.snackbar('L\'utilisateur ' + user.name + ' a bien été ajouté à l\'équipe ' + this.state.team.name);
            if(this.searchField) this.searchField.focus();
        })
        .catch(error => {
            console.log('Error', error)
            if(!createdUser) {
                if(error.status === 'ValidationError'
                && error.formErrors && error.formErrors.login) {
                    NotificationActions.error('Cet utilisateur est déjà assigné à une équipe. Pour le changer d\'équipe vous devez d\'abord le supprimer de son équipe actuelle.', error);
                }
                else {
                    NotificationActions.error('Une erreur s\'est produite pendant la création de l\'utilisateur', error);
                }
            }
            else {
                NotificationActions.error('L\'utilisateur a été créé, mais il n\'a pas été possible de sauvegarder son avatar.', error);
                this.setState({ query: '', users: [] });
                NotificationActions.snackbar('L\'utilisateur ' + user.name + ' a bien été ajouté à l\'équipe ' + this.state.team.name);
                if(this.searchField) this.searchField.focus();
            }
        });
    }

    render() {

        return (
            <div>
                <DialogContent>
                    <p>Pour ajouter un membre à l'équipe <strong>{this.state.team.name}</strong> qui se connectera à partir d'EtuUTT,
                    vous devez le trouver à l'aide du champ de recherche ci-dessous.
                    Vous pouvez rechercher par prénom, nom, surnom, numéro étudiant, login UTT et email.</p>

                            <SearchField
                                error={this.state.error != ''}
                                helperText={this.state.error}
                                label="Recherche EtuUTT"
                                onSubmit={this.handleSubmit}
                                loading={this.state.loading}
                                value={this.state.query}
                                inputRef={(field) => { this.searchField = field; }}
                                fullWidth
                            />
                            { this.state.users ?
                            <List>
                                {
                                    this.state.users.map((user, i) => {

                                        return  (
                                            <ListItem
                                                button
                                                key={user.login}
                                                onTouchTap={() => this._addToTeam(user)}
                                            >
                                                <Avatar src={user.avatar} />
                                                <ListItemText primary={user.name} secondary={user.login} />
                                            </ListItem>
                                        );
                                    })
                                }
                            </List>
                            : ''}
                </DialogContent>
                <DialogActions>
                    <Button
                        color="accent"
                        onTouchTap={this.props.close}
                    >
                        Fermer
                    </Button>
                </DialogActions>
            </div>
        );
    }

}
