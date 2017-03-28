import React from 'react';

import TeamService from '../../services/TeamService';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import SelectGroup from './formElements/SelectGroup.jsx';
import SelectRole from './formElements/SelectRole.jsx';

export default class UpdateTeamInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: props.team
        };

        // binding
        this._deleteTeam = this._deleteTeam.bind(this);
        this._updateTeam = this._updateTeam.bind(this);
        this._setTeamAttribute = this._setTeamAttribute.bind(this);
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
                this.props.closeDialog();
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
        return (
            <div>
                <Button raised accent onClick={this._deleteTeam}>
                    Delete team
                </Button>
                <Button raised primary onClick={this._updateTeam}>
                    Update team
                </Button>
                <SelectGroup selected={this.state.team.group} onChange={v => this._setTeamAttribute('group', v)} />
                <SelectRole selected={this.state.team.role} onChange={v => this._setTeamAttribute('role', v)} />
                <TextField
                    label="New name"
                    value={this.state.team.name}
                    onChange={e => this._setTeamAttribute('name', e.target.value)}
                />
            </div>
        );
    }

}