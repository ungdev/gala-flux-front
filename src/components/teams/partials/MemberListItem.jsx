import React from 'react';

import * as constants from 'config/constants';

import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';


/**
 * This component show a ListItem for a member of a team
 * @param {User} member
 * @param {function(User)} onSelection This function will be called when a member is selected
 */
export default class MemberListItem extends React.Component {

    constructor(props) {
        super(props);

        // binding
        this._handleSelection = this._handleSelection.bind(this);
    }

    /**
     * Call the service to remove a User from a Team
     */
    _handleSelection() {
        this.props.onSelection(this.props.member);
    }

    render() {
        let avatarUri = constants.avatarBasePath + this.props.member.id;
        return (
            <ListItem
                primaryText={this.props.member.name}
                secondaryText={(this.props.member.ip ? this.props.member.ip : this.props.member.login)}
                leftAvatar={<Avatar src={avatarUri} backgroundColor="white" />}
                onTouchTap={this._handleSelection}
            />
        );
    }

}
