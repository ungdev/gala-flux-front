import React from 'react';

import router from '../../router';

import TeamsList from '../teams/TeamList.jsx';

export default class TeamListPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedId: (props.route ? props.route.params.id : null),
        };

        // binding
        this._handleTeamSelection = this._handleTeamSelection.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedId: (nextProps.route ? nextProps.route.params.id : null),
        });
    }

    /**
     * Select a team by changing URI which will update the component with new id
     *
     * @param {object} team
     */
    _handleTeamSelection(team) {
        if(team.id) {
            router.navigate('admin.teams.id', {id: team.id})
        }
        else {
            router.navigate('admin.teams', {id: team.id})
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <TeamsList onTeamSelection={this._handleTeamSelection} selectedId={this.state.selectedId} />
            </div>
        );
    }
}
