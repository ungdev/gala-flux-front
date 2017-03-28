import React from 'react';

import TeamService from '../../services/TeamService';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import SelectGroup from './formElements/SelectGroup.jsx';
import SelectRole from './formElements/SelectRole.jsx';

export default class NewTeam extends React.Component {

    constructor() {
        super();

        this.state = {
            name: "",
            role: "bar",
            group: "bar"
        };

        // binding
        this._createNewTeam = this._createNewTeam.bind(this);
    }

    /**
     * Call the Team Service to create a new team
     */
    _createNewTeam() {
        TeamService.createTeam(this.state, err => {
            if (err) {
                console.log("create team err", err);
            } else {
                this.setState({ name: "", role: "bar", group: "bar" });
            }
        });
    }

    render() {
        return (
            <div>
                <TextField
                    label="Create a new team"
                    onChange={e => this.setState({name: e.target.value})}
                />
                <SelectGroup selected={this.state.group} onChange={v => this.setState({group: v})} />
                <SelectRole selected={this.state.role} onChange={v => this.setState({role: v})} />
                <Button raised primary onClick={this._createNewTeam}>Create</Button>
            </div>
        );
    }

}