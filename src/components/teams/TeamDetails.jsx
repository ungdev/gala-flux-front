import React from 'react';

import TeamStore from '../../stores/TeamStore';
import UserStore from '../../stores/UserStore';
import NotificationActions from '../../actions/NotificationActions'

import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TeamMember from './TeamMember.jsx';
import UpdateTeam from './UpdateTeam.jsx';
import AddEtuuttMember from './AddEtuuttMember.jsx';
import AddIpMember from './AddIpMember.jsx';


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
            showAddEtuuttMemberDialog: false,
            showAddIpMemberDialog: false,
        };

        // binding
        this._toggleUpdateDialog = this._toggleUpdateDialog.bind(this);
        this._toggleAddEtuuttMemberDialog = this._toggleAddEtuuttMemberDialog.bind(this);
        this._toggleAddIpMemberDialog = this._toggleAddIpMemberDialog.bind(this);
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
        let newState = {};
        // Load team in store
        TeamStore.loadData({id: id})
        .then(data => {
            // save the component token
            this.TeamStoreToken = data.token;
            newState.team = data.result[0];

            // Load members in store
            return UserStore.loadData({team: id})
        })
        .then(data => {
            // save the component token
            this.UserStoreToken = data.token;
            newState.members = data.result;

            // Finally set state with new data
            this.setState(newState);
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
     * Show or hide AddEtuuttMember dialog
     */
    _toggleAddEtuuttMemberDialog() {
        this.setState({showAddEtuuttMemberDialog: !this.state.showAddEtuuttMemberDialog});
    }

    /**
     * Show or hide AddIpMember dialog
     */
    _toggleAddIpMemberDialog() {
        this.setState({showAddIpMemberDialog: !this.state.showAddIpMemberDialog});
    }

    render() {
        // if there is a selected team, display details about it
        if (this.state.team) {

            const style = {
                container: {
                    position: 'relative',
                    height: '100%',
                    overflow: 'auto',
                },
                divider: {
                    marginTop: '20px',
                },
                button: {
                    float: 'right',
                    marginTop: '15px',
                    marginLeft: '10px',
                }
            };

            return (
                <div className="container-hide">
                    <div style={style.container}>
                        <RaisedButton primary style={style.button} onTouchTap={this._toggleUpdateDialog} label="Modifier l'équipe"/>
                        <h2>{this.state.team.name}</h2>
                        <div>
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
                        </div>

                        <Divider style={style.divider} />
                        <RaisedButton primary style={style.button} onTouchTap={this._toggleAddEtuuttMemberDialog} label="Ajouter un membre EtuUTT"/>
                        <RaisedButton primary style={style.button} onTouchTap={this._toggleAddIpMemberDialog} label="Ajouter un membre IP"/>
                        <h3>Liste des membres de l'équipe</h3>
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
                                <span>No members</span>
                        }
                        <UpdateTeam
                            show={this.state.showUpdateDialog}
                            close={this._toggleUpdateDialog}
                            team={this.state.team}
                        />
                        <AddEtuuttMember
                            show={this.state.showAddEtuuttMemberDialog}
                            close={this._toggleAddEtuuttMemberDialog}
                            team={this.state.team}
                        />
                        <AddIpMember
                            show={this.state.showAddIpMemberDialog}
                            close={this._toggleAddIpMemberDialog}
                            team={this.state.team}
                        />
                    </div>
                </div>
            );
        }

        // if no selected team, display a message
        let style = {
            container: {
                textAlign: 'center',
                paddingTop: '100px',
            }
        };

        return (
            <div style={style.container}>
                <big>Veuillez sélectionner une équipe</big>
            </div>
        );
    }

}
