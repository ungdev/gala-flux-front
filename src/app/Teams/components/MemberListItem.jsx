import React from 'react';

import * as constants from 'config/constants';

import { ListItem, ListItemText } from 'material-ui/List';
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
        let avatarUri = constants.avatarBasePath + this.props.member.id  + '?u=' + this.props.member.updatedAt;
        return (
            <ListItem
                onTouchTap={this._handleSelection}
            >
                <Avatar src={avatarUri} />
                <ListItemText 
                    primary={this.props.member.name}
                    secondary={(this.props.member.ip ? this.props.member.ip : this.props.member.login)}
                />
            </ListItem>
        );
    }

}
