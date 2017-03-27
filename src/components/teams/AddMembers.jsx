import React from 'react';

import UserStore from '../../stores/UserStore';
import UserService from '../../services/UserService';
import TeamStore from '../../stores/TeamStore';

import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import { Table, TableHead, TableBody, TableRow, TableCell } from 'material-ui/Table';

export default class AddMembers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            teamId: props.teamId
        };

        // binding
        this._filterUsers = this._filterUsers.bind(this);
        this._addToTeam = this._addToTeam.bind(this);
    }

    componentDidMount() {
        this._filterUsers(null);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ teamId: nextProps.teamId });
    }

    _filterUsers(name) {
        let users = UserStore.users.filter(user => user.team != this.state.teamId);
        // if there is something in the auto complete input, filter by name
        if (name) {
            const regExp = new RegExp("^" + name, 'i');
            users = users.filter(user => user.name.match(regExp, 'i'));
        }
        this.setState({ users });
    }

    _addToTeam(uid) {
        const data = {
            team: this.state.teamId
        };
        UserService.updateUser(uid, data, err => {
            console.log("update user error : ", err);
        });
    }

    render() {
        return (
            <div>
                <TextField
                    label="Search a member"
                    onChange={e => this._filterUsers(e.target.value)}
                />
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Add</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.users.map((user, i) => {
                                    return  <TableRow key={i}>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{TeamStore.getTeamName(user.team)}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={_ => this._addToTeam(user.id)}>+</IconButton>
                                                </TableCell>
                                            </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

}