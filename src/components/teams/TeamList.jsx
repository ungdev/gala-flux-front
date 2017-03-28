import React from 'react';

import { List, ListItem, ListItemText } from 'material-ui/List';
import NewTeam from './NewTeam.jsx';

export default class TeamList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: props.teams
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ teams: nextProps.teams });
    }

    render() {
        return (
            <div>
                <NewTeam />
                <List>
                    {
                        // For each message, create a Message component
                        this.state.teams.map((team, i) => {
                            return  <ListItem button key={i}>
                                        <ListItemText
                                            primary={team.name}
                                            secondary={team.role}
                                            onClick={_ => this.props.showTeam(team)}
                                        />
                                    </ListItem>
                        })
                    }
                </List>
            </div>
        );
    }

}