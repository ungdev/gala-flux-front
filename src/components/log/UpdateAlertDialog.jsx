import React from 'react';

import UserStore from '../../stores/UserStore';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-flexbox-grid';

import NotificationActions from '../../actions/NotificationActions';

export default class UpdateAlertDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: (props.alert ? props.alert : null),
            values: {
                'assignedUsers': (props.alert ? props.alert.users : ''),
                'severity': (props.alert ? props.alert.severity : '')
            },
            errors: {},
            users: [],
            selectedUser: 0
        };

        this._handleSubmit = this._handleSubmit.bind(this);
        this._updateData = this._updateData.bind(this);
        this._handleUserChange = this._handleUserChange.bind(this);
    }

    componentDidMount() {
        this._loadData();
        UserStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        this._unloadData();
        UserStore.removeChangeListener(this._updateData);
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
        users.unshift(null);
        this.setState({ users: users });
    }

    _handleUserChange(event, index, value) {
        this.setState({ selectedUser: value });
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

        AlertService.update(this.state.alert.id, this.state.values)
            .then((alert) => {
                NotificationActions.snackbar('L\'alerte ' + alert.name + ' a bien été modifiée.');
                this.focusField.focus();
                this.props.close();
            })
            .catch((error) => {
                let errors = {};
                this.setState({ errors: errors });

                if(!errors) {
                    NotificationActions.error('Une erreur s\'est produite pendant la modification de l\'alerte', error);
                }
            });
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
                title={'Modification de l\'état de l\'alerte "' + this.props.alert.title + '"'}
                open={this.props.show}
                actions={actions}
                autoScrollBodyContent={true}
                modal={false}
                onRequestClose={this.props.close}
            >
                Vous pouvez modifier l'état de l'alerte <strong>{this.props.alert.title}</strong> à l'aide du formulaire ci-dessous.

                <form onSubmit={this._handleSubmit}>
                    <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>
                    <Row>
                        <Col xs={12} sm={6}>
                            <SelectField
                                floatingLabelText="Assigné n°1"
                                value={this.state.selectedUser}
                                onChange={this._handleUserChange}
                            >
                                {
                                    this.state.users.map((user, i) => {
                                        return <MenuItem key={i} value={i} primaryText={user ? user.name : ''} />
                                    })
                                }
                            </SelectField>
                        </Col>
                    </Row>
                </form>
            </Dialog>
        );
    }

}
