import React from 'react';

import TeamStore from '../../stores/TeamStore';
import UserStore from '../../stores/UserStore';
import NotificationActions from '../../actions/NotificationActions'

import { List, ListItem } from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import EditorModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import Divider from 'material-ui/Divider';
import TeamMember from './TeamMember.jsx';
import UpdateTeamDialog from './dialogs/UpdateTeamDialog.jsx';
import AddMemberDialog from './dialogs/AddMemberDialog.jsx';
import CenteredMessage from '../partials/CenteredMessage.jsx';


/**
 * This component will show details of a team with a member list
 * @param {string} id id of the team
 */
export default class TeamDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: null,
            members: null,
            showUpdateDialog: false,
            showAddMemberDialog: false,
        };

        // binding
        this._toggleUpdateDialog = this._toggleUpdateDialog.bind(this);
        this._toggleAddMemberDialog = this._toggleAddMemberDialog.bind(this);
        this._loadData = this._loadData.bind(this);
        this._unloadData = this._unloadData.bind(this);
        this._updateData = this._updateData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // clear stores
        this._unloadData();

        // Reload new team info
        this._loadData(nextProps.id);
    }

    componentDidMount() {
        // Load data from the store
        this._loadData(this.props.id);

        // listen the stores changes
        TeamStore.addChangeListener(this._updateData);
        UserStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        // clear stores
        this._unloadData();

        // remove the stores listeners
        TeamStore.removeChangeListener(this._updateData);
        UserStore.removeChangeListener(this._updateData);
    }

    /**
     * Load data from all stores and update state
     * @param {strnig} id
     */
    _loadData(id) {
        // Load only if a team is specified
        if(!id) {
            return;
        }

        let newState = {};
        // Load team in store
        TeamStore.loadData({id: id})
        .then(data => {
            // ensure that last token doen't exist anymore.
            TeamStore.unloadData(this.TeamStoreToken);

            // save the component token
            this.TeamStoreToken = data.token;

            // Load members in store
            return UserStore.loadData({team: id});
        })
        .then(data => {
            // ensure that last token doen't exist anymore.
            UserStore.unloadData(this.UserStoreToken);

            // save the component token
            this.UserStoreToken = data.token;

            // Finally update component state
            this._updateData();
        })
        .catch(error => {
            NotificationActions.error('Une erreur s\'est produite pendant le chargement des informations sur l\'équipe', error);
        });
    }

    /**
     * clear stores
     */
    _unloadData() {
        TeamStore.unloadData(this.TeamStoreToken);
        UserStore.unloadData(this.UserStoreToken);
    }

    /**
     * Update data according to stores without adding new filter to it
     */
    _updateData() {
        this.setState({
            team: TeamStore.findById(this.props.id),
            members: UserStore.find({team: this.props.id}),
        });
    }


    /**
     * Show or hide the update dialog
     */
    _toggleUpdateDialog() {
        this.setState({ showUpdateDialog: !this.state.showUpdateDialog });
    }


    /**
     * Show or hide AddMember dialog
     */
    _toggleAddMemberDialog() {
        this.setState({showAddMemberDialog: !this.state.showAddMemberDialog});
    }

    render() {
        // if there is a selected team, display details about it
        if (this.state.team) {

            return (
                <div className="FloatingButtonContainer">
                    <div>
                        <h2 className="ListHeader">{this.state.team.name}</h2>
                        <List>
                            <ListItem
                                primaryText="Nom de l'équipe"
                                secondaryText={this.state.team.name}
                                onTouchTap={this._toggleUpdateDialog}
                            />
                            <ListItem
                                primaryText="Emplacement"
                                secondaryText={this.state.team.location}
                                onTouchTap={this._toggleUpdateDialog}
                            />
                            <ListItem
                                primaryText="Autorisations"
                                secondaryText={this.state.team.role}
                                onTouchTap={this._toggleUpdateDialog}
                            />
                            <ListItem
                                primaryText="Groupe de discussion"
                                secondaryText={this.state.team.group}
                                onTouchTap={this._toggleUpdateDialog}
                            />
                        </List>

                        <Divider />
                        <h3 className="ListHeader">Liste des membres de l'équipe</h3>
                        {
                            // if there are members in the team, display them.
                            // else, show a message
                            (this.state.members && this.state.members.length)
                                ?
                                <List>
                                    {
                                        this.state.members.map((member, i) => {
                                            return <TeamMember member={member} key={i}/>
                                        })
                                    }
                                </List>
                                :
                                <CenteredMessage>Il n'y a personne dans cette équipe</CenteredMessage>
                        }
                    </div>

                    <FloatingActionButton
                        className="FloatingButton--secondary"
                        onTouchTap={this._toggleUpdateDialog}
                        secondary={true}
                    >
                        <EditorModeEditIcon />
                    </FloatingActionButton>

                    <FloatingActionButton
                        className="FloatingButton"
                        onTouchTap={this._toggleAddMemberDialog}
                    >
                        <ContentAddIcon />
                    </FloatingActionButton>


                    <AddMemberDialog
                        show={this.state.showAddMemberDialog}
                        close={this._toggleAddMemberDialog}
                        team={this.state.team}
                    />
                    <UpdateTeamDialog
                        show={this.state.showUpdateDialog}
                        close={this._toggleUpdateDialog}
                        team={this.state.team}
                    />
                </div>
            );
        }

        // if no selected team, display a message
        return (
            <CenteredMessage>Veuillez sélectionner une équipe</CenteredMessage>
        );
    }

}
