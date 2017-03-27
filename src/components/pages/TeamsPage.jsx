import React from 'react';

import TeamService from '../../services/TeamService';
import UserService from '../../services/UserService';
import TeamStore from '../../stores/TeamStore';
import UserStore from '../../stores/UserStore';

import Layout from 'material-ui/Layout';
import TeamsList from '../teams/TeamList.jsx';
import TeamDetails from '../teams/TeamDetails.jsx';

export default class TeamsPage extends React.Component {

    constructor() {
        super();

        this.state = {
            teams: [],
            selectedTeam: {
                team: null,
                members: null
            }
        };

        // binding
        this._onTeamStoreChange = this._onTeamStoreChange.bind(this);
        this._showTeam = this._showTeam.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        TeamStore.addChangeListener(this._onTeamStoreChange);
        UserStore.addChangeListener(this._onUserStoreChange);
        // trigger action for the store to load teams
        TeamService.getTeams(err => {
            console.log("get teams error : ", err);
        });
        // trigger action for the store to load users
        UserService.getUsers(err => {
            console.log("get users error : ", err);
        });
    }

    componentWillUnmount() {
        // remove the stores listeners
        TeamStore.removeChangeListener(this._onTeamStoreChange);
        UserStore.removeChangeListener(this._onUserStoreChange);
    }

    /**
     * Get the teams from TeamStore and set the state
     */
    _onTeamStoreChange() {
        this.setState({ teams: TeamStore.teams });
    }

    /**
     * if there is a team selected, update his users list
     */
    _onUserStoreChange() {
        if (this.state.selectedTeam.team) {
            let state = this.state;
            state.selectedTeam.members = UserStore.getByTeam(this.state.selectedTeam.team.id);
            this.setState(state);
        }
    }

    /**
     * Update the team to show in the state
     *
     * @param {object} team
     */
    _showTeam(team) {
        let state = this.state;
        state.selectedTeam.team = team;
        state.selectedTeam.members = UserStore.getByTeam(team.id);
        this.setState(state);
    }

    render() {
        return (
            <div>
                <Layout container gutter={24}>
                    <Layout item xs={12} sm={4} md={6}>
                        <TeamsList showTeam={this._showTeam} teams={this.state.teams} />
                    </Layout>
                    <Layout item xs={12} sm={8} md={6}>
                        <TeamDetails selected={this.state.selectedTeam} />
                    </Layout>
                </Layout>
            </div>
        );
    }

}