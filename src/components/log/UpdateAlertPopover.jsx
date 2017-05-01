import React from 'react';

import UserStore from '../../stores/UserStore';
import AlertService from '../../services/AlertService';
import AuthStore from '../../stores/AuthStore';

import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-flexbox-grid';
import {List, ListItem} from 'material-ui/List';
import Close from 'material-ui/svg-icons/navigation/close';

import NotificationActions from '../../actions/NotificationActions';


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
            users: []
        };

        this._handleSubmit = this._handleSubmit.bind(this);
        this._updateData = this._updateData.bind(this);
        this._addSelectedUser = this._addSelectedUser.bind(this);
        this._removeSelectedUser = this._removeSelectedUser.bind(this);
        this._notAssigned = this._notAssigned.bind(this);
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
            alert: props.alert
        });
    }

    _loadData() {
        let newState = {};
        if(this.state.alert) {
            UserStore.loadData({team: (this.state.alert.receiver ? this.state.alert.receiver.id : AuthStore.team.id) })
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
        let users = UserStore.find({team: (this.state.alert.receiver ? this.state.alert.receiver.id : AuthStore.team.id) });
        users.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.setState({ users: users });
    }

    _addSelectedUser(user) {
        // const user = UserStore.findById(v);
        if (user) {
            let state = this.state;
            console.log(state.alert)
            state.alert.users.push(user.id);
            this.setState(state);


            AlertService.updateAssignedUsers(this.state.alert.id, this.state.alert.users)
            .then(alert => {
                NotificationActions.snackbar("L'alerte \"" + alert.title + "\" a bien été modifiée.");
                this.props.close();
            })
            .catch(error => NotificationActions.error("Une erreur s'est produite pendant la modification de l'alerte", error));
        }
    }

    _removeSelectedUser(id) {
        let state = this.state;
        state.alert.users = state.alert.users.filter(user => user.id !== id);
        this.setState(state);
    }

    /**
     * Check if the user is not already assigned to this alert
     *
     * @param {string} id: the user's id
     * @return {boolean}: not assigned
     */
    _notAssigned(id) {
        for (let user of this.state.alert.users) {
            if (user.id === id) {
                return false;
            }
        }
        return true;
    }

    /**
     * Call the alert Service to update the alert
     *
     * @param {Event} e Event like form submit that will be stopped
     */
    _handleSubmit(e) {
        if (e) {
            e.preventDefault();
        }

        AlertService.updateAssignedUsers(this.state.alert.id, this.state.alert.users)
            .then(alert => {
                NotificationActions.snackbar("L'alerte \"" + alert.title + "\" a bien été modifiée.");
                this.props.close();
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
              open={this.props.open}
              anchorEl={this.props.anchor}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.props.onRequestClose}
            >

                            <List>
                                {this.state.users &&
                                    this.state.users.map((user, i) => {
                                        return  <ListItem
                                            key={i}
                                            primaryText={user.name}
                                            rightIcon={<Close />}
                                            onClick={_ => this._addSelectedUser(user)}
                                        />;
                                    })
                                }
                            </List>
            </Popover>
        );
    }

}
