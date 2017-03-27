import React from 'react';

import { List, ListItem, ListItemText } from 'material-ui/List';

export default class TeamList extends React.Component {

    render() {
        return (
            <div>
                <List>
                    <ListItem button>
                        <ListItemText primary="Team name" secondary="Team group" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Team name" secondary="team group" />
                    </ListItem>
                </List>
            </div>
        );
    }

}