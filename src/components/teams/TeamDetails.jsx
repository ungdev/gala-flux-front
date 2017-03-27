import React from 'react';

import { List, ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

export default class TeamDetails extends React.Component {

    render() {
        return (
            <div>
                <List>
                    <ListItem>
                        <ListItemText primary="Wi-Fi" />
                        <ListItemSecondaryAction>
                            <IconButton>
                                x
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Bluetooth" />
                        <ListItemSecondaryAction>
                            <IconButton>
                                x
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </div>
        );
    }

}