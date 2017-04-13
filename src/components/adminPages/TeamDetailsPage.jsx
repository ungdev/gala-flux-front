import React from 'react';
import { routeNode } from 'react-router5';

import TeamStore from '../../stores/TeamStore';
import UserStore from '../../stores/UserStore';

import TeamDetails from '../teams/TeamDetails.jsx';

export default class TeamDetailsPage extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            team: null,
            members: [],
            id: (props.route ? props.route.params.id : null),
        };

        // binding
        this._updateTeam = this._updateTeam.bind(this);
        this._onUserStoreChange = this._onUserStoreChange.bind(this);
        this._onTeamStoreChange = this._onTeamStoreChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            id: nextProps.route ? nextProps.route.params.id : null,
        });

        this._updateTeam(nextProps.route ? nextProps.route.params.id : null);
    }

    componentDidMount() {
        // listen the stores changes
        TeamStore.addChangeListener(this._onTeamStoreChange);
        UserStore.addChangeListener(this._onUserStoreChange);

        // init team list
        this._updateTeam();
    }

    componentWillUnmount() {
        // remove the stores listeners
        TeamStore.removeChangeListener(this._onTeamStoreChange);
        UserStore.removeChangeListener(this._onUserStoreChange);
    }

    /**
     * Update state.team according to state.id or the given id
     * @param {string} id Facultative target id
     */
    _updateTeam(id) {
        let newId = (id ? id : this.state.id);
        let newState = {};
        newState.team = TeamStore.findOne({id: newId});

        // Update members only if team has changed
        if(newState.team && (!this.state.team || newState.team.id != this.state.team.id)) {
             newState.members = UserStore.getByTeam(newState.team.id);
        }

        this.setState(newState);
    }

    _onTeamStoreChange() {
        this._updateTeam();
    }

    /**
     * if there is a team selected, update his users list
     */
    _onUserStoreChange() {
        if (this.state && this.state.id) {
            this.setState({members: UserStore.getByTeam(this.state.id)});
        }
    }

    render() {
        return (
            <TeamDetails team={this.state.team} members={this.state.members} />
        );
    }
}
