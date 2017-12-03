import React from 'react';

import UserStore from 'stores/UserStore';
import AlertService from 'services/AlertService';
import AuthStore from 'stores/AuthStore';
import * as constants from 'config/constants';

import Popover from 'material-ui/Popover';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemText, ListItemAvatar } from 'material-ui/List';
import CheckIcon from 'material-ui-icons/Check';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';

import NotificationActions from 'actions/NotificationActions';
require('./UpdateAlertPopover.scss');


/**
 * @param {function} onRequestClose Function that will be called to request popover close
 * @param {boolean} open
 * @param {object} anchor Anchor element
 * @param {Alert} alert
 */
export default class UpdateAlertPopover extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filteredUsers: this.getFilteredUsers(props),
        }

        this.handleSelection = this.handleSelection.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        this.setState({ filteredUsers: this.getFilteredUsers(nextProps) });
    }

    /**
     * Generate list of users to show on the list
     */
    getFilteredUsers(props) {
        if(!props) props = this.props;
        let filteredUsers = props.users.find({teamId: (parseInt(props.alert.receiverTeamId) || AuthStore.team.id)}).sortBy('name').toArray();
        filteredUsers = filteredUsers.filter(v => (v.id != AuthStore.user.id));
        filteredUsers.unshift(AuthStore.user);
        filteredUsers.unshift(null);
        return filteredUsers;
    }


    /**
     * Check if the user is not already assigned to this alert
     * @param {Event} e
     * @param {User} id the selected user
     */
    handleSelection(e, user) {
        let id = user ? user.id : null;
        let selectedUsers = this.props.alert.users.slice();
        if(selectedUsers.includes(id)) {
            selectedUsers = selectedUsers.filter(v => (v != id));
        }
        else {
            selectedUsers.push(id);
        }

        // Check if we hide the popover
        let hide = true;
        if(e.ctrlKey) {
            hide = false;
        }

        // Submit to server
        AlertService.update(this.props.alert.id, {users: selectedUsers})
        .then(alert => {
            if(hide) {
                this.props.onRequestClose();
            }
        })
        .catch(error => NotificationActions.error("Une erreur s'est produite pendant la modification de l'alerte", error));

    }

    /**
     * Call the alert Service to update the alert
     * @param {Array} selectedUsers Optionnal selectedUsers, will take state version if undefined
     */
    handleSubmit(selectedUsers) {
        if(selectedUsers === undefined) {
            selectedUsers = this.state.selectedUsers;
        }

        // Submit
    }

    render() {
        return (
            <Popover
                className="Alerts__UpdateAlertPopover"
                open={this.props.open}
                anchorEl={this.props.anchor}
                anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
                transformOrigin={{horizontal: 'center', vertical: 'top'}}
                onRequestClose={this.props.onRequestClose}
            >
                <p><small>Info: <em>Ctrl+Click</em> permet<br/> selectionner plusieurs personnes</small></p>

                <List>
                    {
                        this.state.filteredUsers.map((user, i) => {
                            if(this.props.alert.users.includes(user ? user.id : null)) {
                                return <ListItem
                                        button
                                        key={user ? user.id : -i}
                                        onClick={(e) => this.handleSelection(e, user)}
                                    >
                                        <ListItemAvatar><Avatar><CheckIcon color="white"/></Avatar></ListItemAvatar>
                                        <ListItemText primary={user ? user.name : "Quelqu'un d'autre"} />
                                    </ListItem>;
                            }
                            else {
                                return <ListItem
                                        button
                                        key={user ? user.id : -i}
                                        onClick={(e) => this.handleSelection(e, user)}
                                    >
                                        <ListItemAvatar><Avatar src={(constants.avatarBasePath + (user ? user.id + '?u=' + user.updatedAt : null))} /></ListItemAvatar>
                                        <ListItemText primary={user ? user.name : "Quelqu'un d'autre"} />
                                    </ListItem>;
                            }
                        })
                    }
                </List>
            </Popover>
        );
    }

}
