import React from 'react';

import TeamStore from '../../stores/TeamStore';
import UserStore from '../../stores/UserStore';

import { Grid, Row, Col } from 'react-flexbox-grid';
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
        this._onUserStoreChange = this._onUserStoreChange.bind(this);
        this._showTeam = this._showTeam.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        TeamStore.addChangeListener(this._onTeamStoreChange);
        UserStore.addChangeListener(this._onUserStoreChange);
        // init team list
        this.setState({ teams: TeamStore.teams });
    }

    componentWillUnmount() {
        // remove the stores listeners
        TeamStore.removeChangeListener(this._onTeamStoreChange);
        UserStore.removeChangeListener(this._onUserStoreChange);
    }

    /**
     * Get the teams from TeamStore and set the state
     * If the selected team was deleted or updated, set it too
     */
    _onTeamStoreChange() {
        const state = this.state;
        // refresh the teams
        state.teams = TeamStore.teams;
        // if there was a selected team in the previous state
        if (state.selectedTeam.team) {
            // reset the team, and look if it still exists
            const id = state.selectedTeam.team.id;
            state.selectedTeam.team = null;
            for (let team of state.teams) {
                // if it exists, set the selected team
                if (team.id == id) {
                    state.selectedTeam.team = team;
                    break;
                }
            }
        }

        this.setState(state);
    }

    /**
     * if there is a team selected, update his users list
     */
    _onUserStoreChange() {
        if (this.state && this.state.selectedTeam.team) {
            let state = this.state;
            state.selectedTeam.members = UserStore.getByTeam(state.selectedTeam.team.id);
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
            <Row className="hide-container">
                <Col xs={12} sm={4} md={6} className="hide-container">
                    <TeamsList showTeam={this._showTeam} teams={this.state.teams} selected={this.state.selectedTeam} />
                </Col>
                <Col xs={12} sm={8} md={6} className="hide-container">
                    <TeamDetails selected={this.state.selectedTeam} />
                </Col>
            </Row>
        );
    }
}
