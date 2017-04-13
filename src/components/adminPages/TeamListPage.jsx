import React from 'react';
import { routeNode } from 'react-router5';

import TeamStore from '../../stores/TeamStore';
import UserStore from '../../stores/UserStore';
import router from '../../router';

import TeamsList from '../teams/TeamList.jsx';

export default class TeamListPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: [],
            selected: (props.route ? props.route.params.id : null),
        };

        // binding
        this._onTeamStoreChange = this._onTeamStoreChange.bind(this);
        this._selectTeam = this._selectTeam.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: (nextProps.route ? nextProps.route.params.id : null),
        });
    }

    componentDidMount() {
        // listen the stores changes
        TeamStore.addChangeListener(this._onTeamStoreChange);

        // init team list
        this.setState({ teams: TeamStore.teams });
    }

    componentWillUnmount() {
        // remove the stores listeners
        TeamStore.removeChangeListener(this._onTeamStoreChange);
    }

    /**
     * Get the teams from TeamStore and set the state
     * If the selected team was deleted or updated, set it too
     */
    _onTeamStoreChange() {
        // refresh the teams
        this.setState({teams: TeamStore.teams});
        // if there was a selected team in the previous state
        if (state.selectedTeam) {
            // look if it still exists
            let found = false;
            for (let team of state.teams) {
                // if it exists, set the selected team
                if (team.id == state.selectedTeam) {
                    break;
                }
            }
            if(!found) {
                this._selectedTeam();
            }
        }
    }

    /**
     * Select a team
     *
     * @param {object} team
     */
    _selectTeam(team) {
        if(team.id) {
            router.navigate('admin.teams.id', {id: team.id})
        }
        else {
            router.navigate('admin.teams', {id: team.id})
        }
    }

    render() {
        return (
            <TeamsList showTeam={this._selectTeam} teams={this.state.teams} selected={this.state.selected} />
        );
    }
}
