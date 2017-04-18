import React from 'react';

import TeamStore from '../../stores/TeamStore';

import BarCard from './BarCard.jsx';

export default class BarList extends React.Component {

    constructor() {
        super();

        this.state = {
            teams: []
        };

        this.TeamStoreToken = null;

        // binding
        this._setTeams = this._setTeams.bind(this);
    }

    componentDidMount() {
        // fill the team store
        TeamStore.loadData(null)
            .then(data => {
                // ensure that last token doesn't exist anymore.
                TeamStore.unloadData(this.TeamStoreToken);
                // save the component token
                this.TeamStoreToken = data.token;

                // listen the stores changes
                TeamStore.addChangeListener(this._setTeams);
                // init teams
                this._setTeams();
            })
            .catch(error => console.log("fill TeamStore error", error));
    }

    componentWillUnmount() {
        // clear store
        TeamStore.unloadData(this.TeamStoreToken);
        // remove the listener
        TeamStore.removeChangeListener(this._setTeams);
    }

    /**
     * Update the teams in the state with the teams from TeamStore
     */
    _setTeams() {
        this.setState({ teams: TeamStore.teams });
    }

    render() {
        return (
            <div>
                {
                    this.state.teams.map(team => <BarCard team={team} />)
                }
            </div>
        );
    }

}