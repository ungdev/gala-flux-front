import React from 'react';

import UserStore from '../../stores/UserStore';

import TextField from 'material-ui/TextField';

import { Table, TableHead, TableBody, TableRow, TableCell } from 'material-ui/Table';

export default class AddMembers extends React.Component {

    constructor() {
        super();

        this.state = {
            users: []
        };

        // binding
        this._autoComplete = this._autoComplete.bind(this);
    }

    componentDidMount() {
        this.setState({ users: UserStore.users });
    }

    _autoComplete(e) {
        this.setState({ users: UserStore.getByName(e.target.value) });
    };

    render() {
        return (
            <div>
                <TextField
                    label="Search a member"
                    onChange={this._autoComplete}
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
                                                <TableCell>{user.team}</TableCell>
                                                <TableCell>+</TableCell>
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