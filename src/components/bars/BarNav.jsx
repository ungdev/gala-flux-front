import React from 'react';

import TeamStore from '../../stores/TeamStore';

import router from 'router';
import RaisedButton from 'material-ui/RaisedButton';

import SelectableList from 'components/partials/SelectableList.jsx';
import { ListItem } from 'material-ui/List';

export default class BarNav extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: props.barId,
            teams: []
        };

        this.TeamStoreToken = null;

        // binding
        this._redirect = this._redirect.bind(this);
        this._setTeams = this._setTeams.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.barId
        });
    }

    componentDidMount() {
        TeamStore.loadData(null)
            .then(data => {
                // ensure that last token doesn't exist anymore.
                TeamStore.unloadData(this.TeamStoreToken);
                // save the component token
                this.TeamStoreToken = data.token;

                // listen store changes
                TeamStore.addChangeListener(this._setTeams);

                // init teams in the component state
                this._setTeams();
            })
    }

    _setTeams() {
        this.setState({ teams: TeamStore.teams });
    }

    _handleChange(team) {
        router.navigate('barhome.id', {id: team});
    }

    _redirect() {
        router.navigate('bars');
    }

    render() {
        return (
            <div>
                <RaisedButton onClick={this._redirect} label="Retour à la liste" secondary={true} fullWidth={true} />
                <SelectableList onChange={this._handleChange} value={this.state.selected}>
                    {
                        this.state.teams.map(team => <ListItem key={team.id} value={team.id}>{team.name}</ListItem>)
                    }
                </SelectableList >
            </div>
        );
    }
}