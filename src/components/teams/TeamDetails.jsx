import React from 'react';

import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import TeamMember from './TeamMember.jsx';
import UpdateTeam from './UpdateTeam.jsx';
import AddEtuuttMember from './AddEtuuttMember.jsx';
import AddIpMember from './AddIpMember.jsx';


export default class TeamDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: props.selected,
            showUpdateDialog: false,
            showAddEtuuttMemberDialog: false,
            showAddIpMemberDialog: false,
        };

        // binding
        this._toggleUpdateDialog = this._toggleUpdateDialog.bind(this);
        this._toggleAddEtuuttMemberDialog = this._toggleAddEtuuttMemberDialog.bind(this);
        this._toggleAddIpMemberDialog = this._toggleAddIpMemberDialog.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selected: nextProps.selected });
    }

    /**
     * Show or hide the update dialog
     */
    _toggleUpdateDialog() {
        this.setState({showUpdateDialog: !this.state.showUpdateDialog});
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
        if (this.state.selected.team) {

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
                <div className="hide-container">
                    <div style={style.container}>
                        <RaisedButton primary style={style.button} onTouchTap={this._toggleUpdateDialog} label="Modifier l'équipe"/>
                        <h2>{this.state.selected.team.name}</h2>
                        <div>
                            <List>
                                <ListItem
                                    primaryText="Nom de l'équipe"
                                    secondaryText={this.state.selected.team.name}
                                    onTouchTap={this._toggleUpdateDialog}
                                />
                                <ListItem
                                    primaryText="Emplacement"
                                    secondaryText={this.state.selected.team.location}
                                    onTouchTap={this._toggleUpdateDialog}
                                />
                                <ListItem
                                    primaryText="Autorisations"
                                    secondaryText={this.state.selected.team.role}
                                    onTouchTap={this._toggleUpdateDialog}
                                />
                                <ListItem
                                    primaryText="Groupe de discussion"
                                    secondaryText={this.state.selected.team.group}
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
                            (this.state.selected.members && this.state.selected.members.length)
                                ?
                                <List>
                                    {
                                        this.state.selected.members.map((member, i) => {
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
                            team={this.state.selected.team}
                        />
                        <AddEtuuttMember
                            show={this.state.showAddEtuuttMemberDialog}
                            close={this._toggleAddEtuuttMemberDialog}
                            team={this.state.selected.team}
                        />
                        <AddIpMember
                            show={this.state.showAddIpMemberDialog}
                            close={this._toggleAddIpMemberDialog}
                            team={this.state.selected.team}
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
        }
        return (
            <div style={style.container}>
                <big>Veuillez sélectionner une équipe</big>
            </div>
        );
    }

}
