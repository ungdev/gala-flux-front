import React from 'react';

import TeamStore from '../../stores/TeamStore';

import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

import SelectableList from 'app/components/SelectableList.jsx';
import { ListItem } from 'material-ui/List';
import DataLoader from "app/components/DataLoader.jsx";

export default class TeamSpaceMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: props.team.id,
            teams: null,
        };

        // binding
        this._redirect = this._redirect.bind(this);
    }

    _handleChange(team) {
        browserHistory.push('/overview/' + team);
    }

    _redirect() {
        browserHistory.push('/overview');
    }

    render() {
        return (
            <DataLoader
                filters={new Map([
                    ['Team', null],
                ])}
                onChange={ datastore => this.setState({
                    teams: datastore.Team,
                })}
            >
                { () => (
                    <div>
                        <RaisedButton onClick={this._redirect} label="Retour à la liste" secondary={true} fullWidth={true} />
                        <SelectableList onChange={this._handleChange} value={this.state.selected}>
                            {
                                this.state.teams.map(team => <ListItem key={team.id} value={team.id}>{team.name}</ListItem>)
                            }
                        </SelectableList >
                    </div>
                )}
            </DataLoader>
        );
    }
}
