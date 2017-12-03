import React from 'react';

import TeamStore from '../../stores/TeamStore';

import { browserHistory } from 'react-router';
import Button from 'material-ui/Button';

import SelectableList from 'app/components/SelectableList.jsx';
import { ListItem } from 'material-ui/List';
import DataLoader from "app/components/DataLoader.jsx";


/**
 * @param {int} teamId Team id
 */
export default class TeamSpaceMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: props.teamId,
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
                        <Button raised onClick={this._redirect} color="accent" fullWidth>Retour à la liste</Button>
                        <SelectableList onChange={this._handleChange} value={this.state.selected}>
                            {
                                this.state.teams.map(team => <ListItem key={team.id} value={team.id}>{team.name}</ListItem>)
                            }
                        </SelectableList>
                    </div>
                )}
            </DataLoader>
        );
    }
}
