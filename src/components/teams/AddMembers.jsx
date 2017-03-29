import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import AddIcon from 'material-ui/svg-icons/content/add';

import SelectGroup from './formElements/SelectGroup.jsx';
import SelectRole from './formElements/SelectRole.jsx';
import TeamService from '../../services/TeamService';
import UserStore from '../../stores/UserStore';
import UserService from '../../services/UserService';
import TeamStore from '../../stores/TeamStore';

export default class AddMembers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            team: props.team
        };

        // binding
        this._filterUsers = this._filterUsers.bind(this);
        this._addToTeam = this._addToTeam.bind(this);
    }

    componentDidMount() {
        this._filterUsers(null);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ team: nextProps.team });
    }

    /**
     * Used for the research input
     * Return the users who have a name which start with @name
     *
     * @param {string} name
     */
    _filterUsers(name) {
        let users = UserStore.users.filter(user => user.team != this.state.team.id);
        // if there is something in the auto complete input, filter by name
        if (name) {
            const regExp = new RegExp("^" + name, 'i');
            users = users.filter(user => user.name.match(regExp, 'i'));
        }
        this.setState({ users });
    }

    /**
     * Call the UserService to update his team
     *
     * @param {string} uid : the user id
     */
    _addToTeam(uid) {
        const data = {
            team: this.state.team.id
        };
        UserService.updateUser(uid, data, err => {
            console.log("update user error : ", err);
        });
        // TODO Real error checking before closing
        this.props.close();
    }

    render() {
        const style = {
            deleteButton: {
                float: 'left',
            }
        };

        const actions = [
            <FlatButton
                label="Annuler"
                secondary={true}
                onTouchTap={this.props.close}
            />,
        ];

        return (
            <Dialog
                title={'Ajout de membres à l\'équipe ' + this.state.team.name}
                open={this.props.show}
                actions={actions}
            >

                <TextField
                    floatingLabelText="Cherchez le nom d'un utilisateur.."
                    onChange={e => this._filterUsers(e.target.value)}
                />
                <div>
                    <Table
                        selectable={false}
                        >
                        <TableHeader
                            displaySelectAll={false}
                            >
                            <TableRow>
                                <TableHeaderColumn>User</TableHeaderColumn>
                                <TableHeaderColumn>Team</TableHeaderColumn>
                                <TableHeaderColumn>Add</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            >
                        {
                            this.state.users.map((user, i) => {
                                return  (
                                    <TableRow key={i}>
                                        <TableRowColumn>{user.name}</TableRowColumn>
                                        <TableRowColumn>{TeamStore.getTeamName(user.team)}</TableRowColumn>
                                        <TableRowColumn>
                                            <IconButton onClick={_ => this._addToTeam(user.id)}>
                                                <AddIcon />
                                            </IconButton>
                                        </TableRowColumn>
                                    </TableRow>
                                );
                            })
                        }
                        </TableBody>
                    </Table>
                </div>
            </Dialog>
        );
    }

}
