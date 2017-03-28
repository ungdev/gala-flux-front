import React from 'react';

import UserService from '../../services/UserService';

import { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

export default class TeamMember extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            member: props.member
        };

        // binding
        this._removeFromTeam = this._removeFromTeam.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ member: nextProps.member });
    }

    _removeFromTeam() {
        const data = {
            team: null
        };
        UserService.updateUser(this.state.member.id, data, err => {
            console.log('remove from team err : ', err);
        });
    }

    render() {
        return (
            <ListItem>
                <ListItemText primary={this.state.member.name} />
                <ListItemSecondaryAction>
                    <IconButton onClick={this._removeFromTeam}>
                        x
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }

}