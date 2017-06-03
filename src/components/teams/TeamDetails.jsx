import React from 'react';

import TeamStore from 'stores/TeamStore';
import UserStore from 'stores/UserStore';
import NotificationActions from 'actions/NotificationActions'
import AuthStore from 'stores/AuthStore';

import { List, ListItem } from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import EditorModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import Divider from 'material-ui/Divider';
import MemberListItem from 'components/teams/partials/MemberListItem.jsx';
import UpdateTeamDialog from 'components/teams/dialogs/UpdateTeamDialog.jsx';
import UpdateMemberDialog from 'components/teams/dialogs/UpdateMemberDialog.jsx';
import AddMemberDialog from 'components/teams/dialogs/AddMemberDialog.jsx';
import CenteredMessage from 'components/partials/CenteredMessage.jsx';
import DataLoader from "components/partials/DataLoader.jsx";


/**
 * This component will show details of a team with a member list
 * @param {string} id id of the team
 */
export default class TeamDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showUpdateTeamDialog: false,
            showUpdateMemberDialog: false,
            showAddMemberDialog: false,
            selectedMember: null,
            datastore: null,
            teamId: this.props.id || null,
        };

        // binding
        this._toggleUpdateTeamDialog = this._toggleUpdateTeamDialog.bind(this);
        this._toggleUpdateMemberDialog = this._toggleUpdateMemberDialog.bind(this);
        this._toggleAddMemberDialog = this._toggleAddMemberDialog.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({ teamId: props.id || null});
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
        if(AuthStore.can('user/admin') || (AuthStore.can('user/team') && this.state.teamId == AuthStore.user.team)) {
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
            <DataLoader
                filters={new Map([
                    ['Team', {id: parseInt(this.state.teamId) || null}],
                    ['User', {teamId: parseInt(this.state.teamId) || null}],
                ])}
                onChange={ datastore => this.setState({datastore}) }
            >{ () => {
                const team = this.state.datastore.Team.values().next().value;
                const users = [...this.state.datastore.User.values()];


                // if there is a selected team, display details about it
                if(team) {
                    return (
                    <div className="FloatingButtonContainer">
                        <div>
                            <h2 className="ListHeader">{team.name}</h2>
                            <List>
                                <ListItem
                                    primaryText="Nom de l'équipe"
                                    secondaryText={team.name}
                                    onTouchTap={this._toggleUpdateTeamDialog}
                                />
                                <ListItem
                                    primaryText="Emplacement"
                                    secondaryText={team.location}
                                    onTouchTap={this._toggleUpdateTeamDialog}
                                />
                                <ListItem
                                    primaryText="Autorisations"
                                    secondaryText={team.role}
                                    onTouchTap={this._toggleUpdateTeamDialog}
                                />
                                <ListItem
                                    primaryText="Groupe de discussion"
                                    secondaryText={team.group}
                                    onTouchTap={this._toggleUpdateTeamDialog}
                                />
                            </List>

                            <Divider />
                            <h3 className="ListHeader">Liste des membres de l'équipe</h3>
                            {
                                // if there are members in the team, display them.
                                // else, show a message
                                (users && users.length)
                                    ?
                                    <List>
                                        {
                                            users.map((member, i) => {
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
                            <FloatingActionButton
                                className="FloatingButton--secondary"
                                onTouchTap={this._toggleUpdateTeamDialog}
                                secondary={true}
                            >
                                <EditorModeEditIcon />
                            </FloatingActionButton>
                        }

                        { (AuthStore.can('user/admin') || (AuthStore.can('user/team') && team.id == AuthStore.user.team)) &&
                            <FloatingActionButton
                                className="FloatingButton"
                                onTouchTap={this._toggleAddMemberDialog}
                            >
                                <ContentAddIcon />
                            </FloatingActionButton>
                        }


                        <AddMemberDialog
                            show={this.state.showAddMemberDialog}
                            close={this._toggleAddMemberDialog}
                            team={team}
                        />
                        <UpdateTeamDialog
                            show={this.state.showUpdateTeamDialog}
                            close={this._toggleUpdateTeamDialog}
                            team={team}
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
            }}</DataLoader>
        );
    }

}
