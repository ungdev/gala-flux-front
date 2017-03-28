import React from 'react';

import TeamService from '../../services/TeamService';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

export default class NewTeam extends React.Component {

    constructor() {
        super();

        this.state = {
            name: "",
            role: "bar",
            group: "bar"
        };

        this._createNewTeam = this._createNewTeam.bind(this);
    }

    _createNewTeam() {
        const data = {
            name: this.state.name,
            role: this.state.role,
            group: this.state.group
        };
        TeamService.createTeam(data, err => {
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
                <select onChange={e => this.setState({role: e.target.value})}>
                    <option value="bar">bar</option>
                    <option value="admin">admin</option>
                    <option value="log">log</option>
                </select>
                <select onChange={e => this.setState({group: e.target.value})}>
                    <option value="bar">bar</option>
                    <option value="admin">admin</option>
                    <option value="orga">orga</option>
                    <option value="log">log</option>
                </select>
                <Button raised primary onClick={this._createNewTeam}>Create</Button>
            </div>
        );
    }

}