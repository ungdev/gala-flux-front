import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import Delete from 'material-ui/svg-icons/action/delete';
import AutoComplete from 'material-ui/AutoComplete';

import AlertButtonService from '../../services/AlertButtonService';

export default class UpdateButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            button: props.button,
            categories: props.categories,
            teams: props.teams
        };

        // binding
        this._deleteButton = this._deleteButton.bind(this);
        this._updateButton = this._updateButton.bind(this);
        this._setButtonAttribute = this._setButtonAttribute.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            button: nextProps.button,
            teams: nextProps.teams,
            categories: nextProps.categories
        });
    }

    /**
     * Call the Alert Button service to delete this button.
     * In case of success, close the update dialog (because the button doesn't exists anymore)
     */
    _deleteButton() {
        AlertButtonService.deleteAlertButton(this.state.button.id, (err, result) => {
            if (err) {
                console.log("delete button err : ", err);
            } else {
                this.props.close();
            }
        });
    }

    /**
     * Call the Alert Button service to update this button
     */
    _updateButton() {
        AlertButtonService.updateAlertButton(this.state.button.id, this.state.button, (err, result) => {
            if (err) {
                console.log("update button err : ", err);
            } else {
                this.props.close();
            }
        });
    }

    /**
     * Update an attribute of the alert button object in the component state
     *
     * @param {string} attr : the button attribute to update in the state
     * @param {string} v : the new attribute value
     */
    _setButtonAttribute(attr, v) {
        const button = this.state.button;
        button[attr] = v;
        this.setState({ button });
    }

    render() {

        const button = this.state.button;

        const actions = [
            <FlatButton
                label="Modifier"
                primary={true}
                onClick={this._updateButton}
            />,
            <FlatButton
                label="Annuler"
                secondary={true}
                onClick={this.props.close}
            />,
            <RaisedButton
                secondary={true}
                icon={<Delete />}
                onClick={this._deleteButton}
            />
        ];

        return (
            <Dialog
                title="Modification d'un bouton d'alerte"
                open={this.props.show}
                modal={true}
                onRequestClose={this.props.close}
                actions={actions}
            >
                {
                    button &&
                    <Row>
                        <Col xs={12}>
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Button title"
                                value={button.title}
                                onChange={e => this._setButtonAttribute("title", e.target.value)}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <AutoComplete
                                hintText="Categorie"
                                dataSource={this.state.categories}
                                onUpdateInput={v => this._setButtonAttribute("category", v)}
                                searchText={button.category}
                            />
                            <SelectField
                                onChange={(e, i, v) => this._setButtonAttribute("receiver", v)}
                                value={button.receiver}
                                floatingLabelText="Destinataire"
                            >
                                {
                                    this.state.teams.map((team, i) => {
                                        return <MenuItem key={i} value={team.id} primaryText={team.name} />
                                    })
                                }
                            </SelectField>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Toggle
                                label="Message obligatoire :"
                                onToggle={_ => this._setButtonAttribute("message", !button.message)}
                                style={{maxWidth: 250}}
                                toggled={button.message}
                            />
                            <TextField
                                floatingLabelText="Message placeholder"
                                value={button.messagePlaceholder || ""}
                                onChange={e => this._setButtonAttribute("messagePlaceholder", e.target.value)}
                            />
                        </Col>
                    </Row>
                }
            </Dialog>
        );
    }

}
