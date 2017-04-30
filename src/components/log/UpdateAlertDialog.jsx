import React from 'react';

import UserStore from '../../stores/UserStore';
import AlertService from '../../services/AlertService';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-flexbox-grid';
import {List, ListItem} from 'material-ui/List';
import Close from 'material-ui/svg-icons/navigation/close';

import NotificationActions from '../../actions/NotificationActions';

export default class UpdateAlertDialog extends React.Component {

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
        UserStore.loadData(null)
            .then(data => {
                UserStore.unloadData(this.UserStoreToken);
                this.UserStoreToken = data.token;
                this._updateData();
            })
            .catch(error => {
                NotificationActions.error('Une erreur s\'est produite pendant le chargement des utilisateurs', error);
            });
    }

    _unloadData() {
        UserStore.unloadData(this.UserStoreToken);
    }

    _updateData() {
        let users = UserStore.users;
        users.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.setState({ users: users });
    }

    _addSelectedUser(e, i, v) {
        const user = UserStore.findById(v);
        if (user) {
            let state = this.state;
            state.alert.users.push(user);
            this.setState(state);
        }
    }

    _removeSelectedUser(id) {
        let state = this.state;
        state.alert.users = state.alert.users.filter(user => user.id !== id);
        this.setState(state);
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
            <Dialog 
                title={"Modification de l'état de l'alerte \"" + this.props.alert.title + "\""}
                open={this.props.show}
                actions={actions}
                autoScrollBodyContent={true}
                modal={false}
                onRequestClose={this.props.close}
            >
                Vous pouvez modifier l'état de l'alerte <strong>{this.state.alert.title}</strong> à l'aide du formulaire ci-dessous.
                <form onSubmit={this._handleSubmit}>
                    <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>
                    <Row>
                        <Col md={6} sm={12}>
                            <SelectField
                                floatingLabelText="Ajouter"
                                onChange={this._addSelectedUser}
                            >
                                {
                                    this.state.users.map((user, i) => {
                                        return <MenuItem key={i} value={user.id} primaryText={user.name} />
                                    })
                                }
                            </SelectField>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} sm={12}>
                            <List>
                                {
                                    this.state.alert.users.map((user, i) => {
                                        return  <ListItem
                                            key={i}
                                            primaryText={user.name}
                                            rightIcon={<Close />}
                                            onClick={_ => this._removeSelectedUser(user.id)}
                                        />;
                                    })
                                }
                            </List>
                        </Col>
                    </Row>
                </form>
            </Dialog>
        );
    }

}
