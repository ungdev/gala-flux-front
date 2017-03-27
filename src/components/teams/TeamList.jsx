import React from 'react';

import { List, ListItem, ListItemText } from 'material-ui/List';

export default class TeamList extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            teams: props.teams
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ teams: nextProps.teams })
    }

    render() {
        return (
            <div>
                <List>
                    {
                        // For each message, create a Message component
                        this.state.teams.map((team, i) => {
                            return  <ListItem button key={i}>
                                        <ListItemText primary={team.name} secondary={team.role} />
                                    </ListItem>
                        })
                    }
                </List>
            </div>
        );
    }

}