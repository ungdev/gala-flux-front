import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Grid, Row, Col } from 'react-flexbox-grid';

import AddMembers from './AddMembers.jsx';
import SelectGroup from './formElements/SelectGroup.jsx';
import SelectRole from './formElements/SelectRole.jsx';
import TeamService from '../../services/TeamService';

export default class UpdateTeam extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: props.team,
            users: null
        };

        // binding
        this._deleteTeam = this._deleteTeam.bind(this);
        this._updateTeam = this._updateTeam.bind(this);
        this._setTeamAttribute = this._setTeamAttribute.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ team: nextProps.team });
    }

    /**
     * Call the Team service to delete this Team.
     * In case of success, close the update dialog (because the team doesn't exists anymore)
     */
    _deleteTeam() {
        TeamService.deleteTeam(this.state.team.id, err => {
            if (err) {
                console.log("delete team err : ", err);
            } else {
                this.props.close();
            }
        });
    }

    /**
     * Call the Team service to update this Team
     */
    _updateTeam() {
        TeamService.updateTeam(this.state.team.id, this.state.team, err => {
            if (err) {
                console.log("update team err : ", err);
            } else {
                this.props.close();
            }
        });
    }

    /**
     * Update an attribute of the team object in the component state
     *
     * @param {string} attr : the team attribute to update in the state
     * @param {string} v : the new attribute value
     */
    _setTeamAttribute(attr, v) {
        const team = this.state.team;
        team[attr] = v;
        this.setState({team});
    }

    render() {
        const style = {
            deleteButton: {
                float: 'left',
            }
        };

        const actions = [
            // TODO Move this button or add a confirm
            <FlatButton
                style={style.deleteButton}
                label="Supprimer"
                secondary={true}
                onTouchTap={this._deleteTeam}
            />,
            <FlatButton
                label="Annuler"
                secondary={true}
                onTouchTap={this.props.close}
            />,

            // TODO trigger on field submit
            <FlatButton
                label="Modifier"
                primary={true}
                onTouchTap={this._updateTeam}
            />,
        ];

        return (
            <Dialog
                title={'Modification de l\'équipe ' + this.state.team.name}
                open={this.props.show}
                actions={actions}
                modal={true}
            >

                <Row>
                    <Col xs={12} sm={6}>
                        <TextField
                            floatingLabelText="Nom"
                            value={this.state.team.name}
                            onChange={e => this._setTeamAttribute('name', e.target.value)}
                            required={true}
                        /><br/>
                        <SelectRole
                            selected={this.state.team.role}
                            onChange={v => this._setTeamAttribute('role', v)}
                        /><br/>
                    </Col>
                    <Col xs={12} sm={6}>
                        <TextField
                            floatingLabelText="Emplacement (facultatif)"
                            value={this.state.team.location}
                            onChange={e => this._setTeamAttribute('location', e.target.value)}
                        /><br/>
                        <SelectGroup
                            value={this.state.team.group}
                            onChange={v => this._setTeamAttribute('group', v)}
                        />
                    </Col>
                </Row>
            </Dialog>
        );
    }

}
