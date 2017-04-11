import React from 'react';

import UserService from '../../services/UserService';
import * as constants from '../../config/constants';

import { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

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

    /**
     * Call the service to remove a User from a Team
     */
    _removeFromTeam() {
        // TODO add confirm
        // a user cannot live without a team, so delete it
        UserService.deleteUser(this.state.member.id, err => {
            console.log('remove from team err : ', err);
        });
    }

    render() {
        let secondaryText = (this.state.member.ip ? this.state.member.ip : this.state.member.login);
        let avatarUri = constants.avatarBasePath + this.state.member.id;
        return (
            <ListItem
                primaryText={this.state.member.name}
                secondaryText={secondaryText}
                leftAvatar={<Avatar src={avatarUri} backgroundColor="white" />}
                rightIconButton={(
                    <IconButton
                        tooltip="Supprimer"
                        tooltipPosition="bottom-left"
                        onTouchTap={this._removeFromTeam}
                    >
                        <DeleteIcon />
                    </IconButton>)}
            />
        );
    }

}
