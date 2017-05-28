import React from 'react';

import UserStore from 'stores/UserStore';
import AlertService from 'services/AlertService';
import AuthStore from 'stores/AuthStore';
import * as constants from 'config/constants';

import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-flexbox-grid';
import {List, ListItem} from 'material-ui/List';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import AccountCircleIcon from 'material-ui/svg-icons/action/account-circle';

import NotificationActions from 'actions/NotificationActions';
require('styles/log/UpdateAlertPopover.scss');


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
            alert: props.alert,
            users: [],
            selectedUsers: [...props.alert.users],
            showSubmit: false,
        };

        this._handleSubmit = this._handleSubmit.bind(this);
        this._updateData = this._updateData.bind(this);
        this._handleSelection = this._handleSelection.bind(this);
    }

    componentDidMount() {
        this._loadData();
        UserStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        this._unloadData();
        UserStore.removeChangeListener(this._updateData);
    }

    componentWillReceiveProps(props) {
        this.setState({
            alert: props.alert,
            selectedUsers: [...props.alert.users],
            showSubmit: false,
        });
    }

    _loadData() {
        let newState = {};
        if(this.state.alert) {
            UserStore.loadData({teamId: (this.state.alert.receiverTeamId ? this.state.alert.receiverTeamId : AuthStore.team.id) })
            .then(data => {
                UserStore.unloadData(this.UserStoreToken);
                this.UserStoreToken = data.token;
                this._updateData();
            })
            .catch(error => {
                NotificationActions.error('Une erreur s\'est produite pendant le chargement des utilisateurs', error);
            });
        }
    }

    _unloadData() {
        UserStore.unloadData(this.UserStoreToken);
    }

    _updateData() {
        let users = UserStore.find({teamId: (this.state.alert.receiverTeamId ? this.state.alert.receiverTeamId : AuthStore.team.id) });
        users.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        users.unshift(null);
        this.setState({ users: users });
    }

    /**
     * Check if the user is not already assigned to this alert
     * @param {Event} e
     * @param {User} id the selected user
     */
    _handleSelection(e, user) {
        let id = user ? user.id : null;
        let selectedUsers = this.state.selectedUsers;
        let showSubmit = this.state.showSubmit;
        if(selectedUsers.includes(id)) {
            selectedUsers = selectedUsers.filter(v => v != id);
        }
        else {
            selectedUsers.push(id);
        }

        // submit
        if(e.ctrlKey) {
            showSubmit = true;
        }
        else {
            this._handleSubmit(selectedUsers);
        }

        // Save
        this.setState({selectedUsers, showSubmit});
    }

    /**
     * Call the alert Service to update the alert
     * @param {Array} selectedUsers Optionnal selectedUsers, will take state version if undefined
     */
    _handleSubmit(selectedUsers) {
        if(selectedUsers === undefined) {
            selectedUsers = this.state.selectedUsers;
        }

        // Submit
        AlertService.update(this.state.alert.id, {users: selectedUsers})
            .then(alert => {
                this.props.onRequestClose();
            })
            .catch(error => NotificationActions.error("Une erreur s'est produite pendant la modification de l'alerte", error));
    }

    render() {

        const actions = [
            <FlatButton
                label="Annuler"
                secondary={true}
                onTouchTap={this.props.close}
            />,
            <FlatButton
                label="Modifier"
                primary={true}
                onTouchTap={this._handleSubmit}
            />,
        ];

        return (
            <Popover
                className="UpdateAlertPopover"
                open={this.props.open}
                anchorEl={this.props.anchor}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.props.onRequestClose}
            >
                <p><small>Info: <em>Ctrl+Click</em> permet<br/> selectionner plusieurs personnes</small></p>

                <List>
                    {this.state.users &&
                        this.state.users.map((user, i) => {
                            if(this.state.selectedUsers.includes(user ? user.id : null)) {
                                return <ListItem
                                        key={i}
                                        primaryText={user ? user.name : "Quelqu'un d'autre"}
                                        leftAvatar={<Avatar backgroundColor="#00AFCA" ><CheckIcon color="white"/></Avatar>}
                                        onClick={(e) => this._handleSelection(e, user)}
                                    />;
                            }
                            else {
                                return <ListItem
                                        key={i}
                                        primaryText={user ? user.name : "Quelqu'un d'autre"}
                                        leftAvatar={<Avatar src={(constants.avatarBasePath + (user ? user.id + '?u=' + user.updatedAt : null))} backgroundColor="white" />}
                                        onClick={(e) => this._handleSelection(e, user)}
                                    />;
                            }
                        })
                    }
                </List>
                { this.state.showSubmit &&
                    <FlatButton
                        label="Valider"
                        secondary={true}
                        onClick={() => this._handleSubmit()}
                        fullWidth={true}
                    />
                }
            </Popover>
        );
    }

}
