import React from 'react';

import { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

export default class TeamMember extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            member: props.member
        }
    }

    render() {
        return (
            <ListItem>
                <ListItemText primary={this.state.member.name} />
                <ListItemSecondaryAction>
                    <IconButton>
                        x
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }

}