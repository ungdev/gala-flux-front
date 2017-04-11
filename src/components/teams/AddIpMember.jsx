import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';

import UserService from '../../services/UserService';
import NotificationActions from '../../actions/NotificationActions';

export default class AddIpMember extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: props.team,
            values: {
                'name': 'PC',
                'ip': '',
            },
            errors: {},
        };

        // binding
        this._handleFieldChange = this._handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ team: nextProps.team });
    }

    /**
     * Called on field change
     *
     * @param  {string} field Field name
     * @param  {string} value New value
     */
    _handleFieldChange(field, value) {
        let values = this.state.values;
        values[field] = value;
        this.setState({values: values, errors: {}});
    }

    /**
     * Call the UserService to create user
     *
     * @param {Object} user EtuUTT user object
     */
    _handleSubmit() {
        // Pre-check
        let errors = {};
        if(!this.state.values.ip) {
            errors.ip = 'Ce champ est obligatoire';
        }
        if(!this.state.values.name) {
            errors.name = 'Ce champ est obligatoire';
        }
        if(Object.keys(errors).length) {
            this.setState({ errors: errors });
            return;
        }

        // Submit
        console.log('start');
        UserService.createUser({
            team: this.state.team.id,
            name: this.state.values.name,
            ip: this.state.values.ip,
        })
        .then((user) => {
            console.log(user);
            this.setState({ values: {
                name: 'PC',
                ip: '',
            } });
            NotificationActions.snackbar('L\'utilisateur ' + user.name + ' a bien été ajouté à l\'équipe ' + this.state.team.name);
            this.focusField.focus();
        })
        .catch((error) => {
            console.log(error);
            let errors = {};
            if(error.status === 'ValidationError' && error.formErrors) {
                for (let field in error.formErrors) {
                    console.log(error.formErrors[field][0]);
                    if(field == 'ip' && error.formErrors[field][0].rule == 'unique') {
                        errors[field] = 'Cet IP a déjà été assigné à un autre utilisateur';
                    }
                    else if(error.formErrors[field][0].rule == 'ip') {
                        errors[field] = 'Cette ip n\'est pas valide';
                    }
                    else {
                        errors[field] = error.formErrors[field][0].message;
                        console.log('Warning: Validation message not translated. ', error.formErrors[field]);
                    }
                }
                this.setState({ errors: errors });
            }
            if(!errors) {
                NotificationActions.error('Une erreur s\'est produite pendant la création de l\'utilisateur', error);
            }
        });
    }

    render() {

        const actions = [
            <FlatButton
                label="Fermer"
                secondary={true}
                onTouchTap={this.props.close}
            />,
            <FlatButton
                label="Ajouter"
                primary={true}
                onTouchTap={this._handleSubmit}
            />,
        ];

        return (
            <Dialog
                title={'Ajout d\'un membre IP'}
                open={this.props.show}
                actions={actions}
                autoScrollBodyContent={true}
                modal={false}
                onRequestClose={this.props.close}
            >
                Pour ajouter un membre à l'équipe <strong>{this.state.team.name}</strong> qui
                se connectera automatiquement en fonction de son ip, il vous
                suffit d'entrer l'ip et le nom du compte dans le formulaire ci-dessous.<br/>


                <form onSubmit={this._handleSubmit}>
                    <Row>
                        <Col xs={12} sm={6}>
                            <TextField
                                floatingLabelText="Nom"
                                errorText={this.state.errors.name}
                                value={this.state.values.name}
                                fullWidth={true}
                                onChange={e => this._handleFieldChange('name', e.target.value)}
                                autoFocus={true}
                                ref={(field) => { this.focusField = field; }}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <TextField
                                floatingLabelText="IP"
                                errorText={this.state.errors.ip}
                                value={this.state.values.ip}
                                fullWidth={true}
                                onChange={e => this._handleFieldChange('ip', e.target.value)}
                            />
                        </Col>
                    </Row>
                </form>
            </Dialog>
        );
    }

}
