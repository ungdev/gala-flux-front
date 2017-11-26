import React from 'react';

import TeamStore from 'stores/TeamStore';
import UserStore from 'stores/UserStore';
import NotificationActions from 'actions/NotificationActions'
import AuthStore from 'stores/AuthStore';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import ContentAddIcon from 'material-ui-icons/Add';
import EditorModeEditIcon from 'material-ui-icons/ModeEdit';
import Divider from 'material-ui/Divider';
import MemberListItem from 'app/Teams/components/MemberListItem.jsx';
import UpdateTeamDialog from 'app/Teams/dialogs/UpdateTeamDialog.jsx';
import UpdateMemberDialog from 'app/Teams/dialogs/UpdateMemberDialog.jsx';
import AddMemberDialog from 'app/Teams/dialogs/AddMemberDialog.jsx';
import CenteredMessage from 'app/components/CenteredMessage.jsx';
import DataLoader from "app/components/DataLoader.jsx";


/**
 * This component will show details of a team with a member list
 * @param {string} id id of the team
 */
export default class TeamDetailsScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showUpdateTeamDialog: false,
            showUpdateMemberDialog: false,
            showAddMemberDialog: false,
            selectedMember: null,
            team: null,
            users: null,
        };

        // binding
        this._toggleUpdateTeamDialog = this._toggleUpdateTeamDialog.bind(this);
        this._toggleUpdateMemberDialog = this._toggleUpdateMemberDialog.bind(this);
        this._toggleAddMemberDialog = this._toggleAddMemberDialog.bind(this);
    }

    /**
     * Show or hide the update team dialog
     */
    _toggleUpdateTeamDialog() {
        if(AuthStore.can('team/admin')) {
            this.setState({ showUpdateTeamDialog: !this.state.showUpdateTeamDialog });
        }
    }

    /**
     * Show or hide the update member dialog
     * @param {User} member Selected member (optional)
     */
    _toggleUpdateMemberDialog(member) {
        if(AuthStore.can('user/admin') || (AuthStore.can('user/team') && this.props.id == AuthStore.user.team)) {
            this.setState({
                showUpdateMemberDialog: (!this.state.showUpdateMemberDialog && member != false),
                selectedMember: member ? member : null,
            });
        }
    }

    /**
     * Show or hide AddMember dialog
     */
    _toggleAddMemberDialog() {
        this.setState({showAddMemberDialog: !this.state.showAddMemberDialog});
    }

    render() {
        return (
            <div className="FloatingButtonContainer">
                <DataLoader
                    filters={new Map([
                        ['Team', {id: parseInt(this.props.id)}],
                        ['User', {teamId: parseInt(this.props.id)}],
                    ])}
                    onChange={ datastore => this.setState({
                        team: datastore.Team.first,
                        users: datastore.User,
                    })}
                >
                    { () => {

                        // if there is a selected team, display details about it
                        if(this.state.team) {
                            return (
                            <div className="FloatingButtonContainer">
                                <div>
                                    <h2 className="ListHeader">{this.state.team.name}</h2>
                                    <List>
                                        <ListItem
                                            onTouchTap={this._toggleUpdateTeamDialog}
                                        >
                                            <ListItemText 
                                                primary="Nom de l'équipe"
                                                secondary={this.state.team.name}
                                            />
                                        </ListItem>
                                        <ListItem
                                            onTouchTap={this._toggleUpdateTeamDialog}
                                        >
                                            <ListItemText 
                                                primary="Emplacement"
                                                secondary={this.state.team.location}
                                            />
                                        </ListItem>
                                        <ListItem
                                            onTouchTap={this._toggleUpdateTeamDialog}
                                        >
                                            <ListItemText 
                                                primary="Autorisations"
                                                secondary={this.state.team.role}
                                            />
                                        </ListItem>
                                        <ListItem
                                            onTouchTap={this._toggleUpdateTeamDialog}
                                        >
                                            <ListItemText 
                                                primary="Groupe de discussion"
                                                secondary={this.state.team.group}
                                            />
                                        </ListItem>
                                    </List>

                                    <Divider />
                                    <h3 className="ListHeader">Liste des membres de l'équipe</h3>
                                    {
                                        // if there are members in the team, display them.
                                        // else, show a message
                                        (this.state.users.length)
                                            ?
                                            <List>
                                                {
                                                    this.state.users.map((member, i) => {
                                                        return <MemberListItem
                                                            member={member}
                                                            key={i}
                                                            onSelection={(member) => this._toggleUpdateMemberDialog(member)}
                                                        />
                                                    })
                                                }
                                            </List>
                                            :
                                            <CenteredMessage>Il n'y a personne dans cette équipe</CenteredMessage>
                                    }
                                </div>

                                { AuthStore.can('team/admin') &&
                                    <Button
                                        fab
                                        className="FloatingButton--secondary"
                                        onTouchTap={this._toggleUpdateTeamDialog}
                                        color="accent"
                                    >
                                        <EditorModeEditIcon />
                                    </Button>
                                }

                                { (AuthStore.can('user/admin') || (AuthStore.can('user/team') && this.state.team.id == AuthStore.user.team)) &&
                                    <Button
                                        fab
                                        className="FloatingButton"
                                        onTouchTap={this._toggleAddMemberDialog}
                                        color="primary"
                                    >
                                        <ContentAddIcon />
                                    </Button>
                                }


                                <AddMemberDialog
                                    show={this.state.showAddMemberDialog}
                                    close={this._toggleAddMemberDialog}
                                    team={this.state.team}
                                />
                                <UpdateTeamDialog
                                    show={this.state.showUpdateTeamDialog}
                                    close={this._toggleUpdateTeamDialog}
                                    team={this.state.team}
                                />
                                <UpdateMemberDialog
                                    show={this.state.showUpdateMemberDialog}
                                    close={() => this._toggleUpdateMemberDialog()}
                                    member={this.state.selectedMember}
                                />
                            </div>)
                        }
                        else {
                            return <CenteredMessage>Veuillez sélectionner une équipe</CenteredMessage>
                        }
                    }}
                </DataLoader>
            </div>
        );
    }

}
