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
        this.redirect = this.redirect.bind(this);
    }

    handleChange(team) {
        browserHistory.push('/overview/' + team);
    }

    redirect() {
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
                        <Button raised onClick={this.redirect} color="accent" fullWidth>Retour à la liste</Button>
                        <SelectableList onChange={this.handleChange} value={this.state.selected}>
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
