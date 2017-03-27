import React from 'react';

import TeamService from '../../services/TeamService';
import TeamStore from '../../stores/TeamStore';

import Layout from 'material-ui/Layout';
import TeamsList from '../teams/TeamList.jsx';
import TeamDetails from '../teams/TeamDetails.jsx';

export default class TeamsPage extends React.Component {

    constructor() {
        super();

        this.state = {
            teams: []
        };

        // binding
        this._onTeamStoreChange = this._onTeamStoreChange.bind(this);
    }

    componentDidMount() {
        // listen the store changes
        TeamStore.addChangeListener(this._onTeamStoreChange);
        // trigger action for the store to load teams
        TeamService.getTeams(err => {
            console.log("get teams error : ", err);
        });
    }

    componentWillUnmount() {
        // remove the store listener
        TeamStore.removeChangeListener(this._onTeamStoreChange);
    }

    /**
     * Get the teams from TeamStore and set the state
     */
    _onTeamStoreChange() {
        this.setState({ teams: TeamStore.teams });
    }

    render() {
        return (
            <div>
                <Layout container gutter={24}>
                    <Layout item xs={12} sm={4} md={6}>
                        <TeamsList teams={this.state.teams} />
                    </Layout>
                    <Layout item xs={12} sm={8} md={6}>
                        <TeamDetails />
                    </Layout>
                </Layout>
            </div>
        );
    }

}