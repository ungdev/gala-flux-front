import React from 'react';

import TeamStore from 'stores/TeamStore';
import BarrelStore from 'stores/BarrelStore';
import UserStore from 'stores/UserStore';
import SessionStore from 'stores/SessionStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import NotificationActions from 'actions/NotificationActions';

import { Row, Col } from 'react-flexbox-grid';
import BarCard from 'components/bars/BarCard.jsx';

require('styles/bars/BarList.scss');

export default class BarList extends React.Component {

    constructor() {
        super();

        this.state = {
            teams: [],
            barrels: {},
            users: {}
        };

        this.TeamStoreToken = null;
        this.BarrelStoreToken = null;
        this.BarrelTypeStoreToken = null;
        this.UserStoreToken = null;
        this.SessionStoreToken = null;

        // binding
        this._setTeams = this._setTeams.bind(this);
        this._setBarrels = this._setBarrels.bind(this);
        this._setUsers = this._setUsers.bind(this);
    }

    componentDidMount() {
        // fill the team store
        TeamStore.loadData(null)
        .then(data => {
            // ensure that last token doesn't exist anymore.
            TeamStore.unloadData(this.TeamStoreToken);
            // save the component token
            this.TeamStoreToken = data.token;

            return BarrelStore.loadData(null);
        })
        .then(data => {
            // ensure that last token doesn't exist anymore.
            BarrelStore.unloadData(this.BarrelStoreToken);
            // save the component token
            this.BarrelStoreToken = data.token;

            return BarrelTypeStore.loadData(null);
        })
        .then(data => {
            // ensure that last token doesn't exist anymore.
            BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);
            // save the component token
            this.BarrelTypeStoreToken = data.token;

            return SessionStore.loadData(null);

        })
        .then(data => {
            // ensure that last token doesn't exist anymore.
            SessionStore.unloadData(this.SessionStoreToken);
            // save the component token
            this.SessionStoreToken = data.token;

            return UserStore.loadData(null);

        })
        .then(data => {
            // ensure that last token doesn't exist anymore.
            UserStore.unloadData(this.UserStoreToken);
            // save the component token
            this.UserStoreToken = data.token;

            // listen the stores changes
            TeamStore.addChangeListener(this._setTeams);
            BarrelStore.addChangeListener(this._setBarrels);
            UserStore.addChangeListener(this._setUsers);
            SessionStore.addChangeListener(this._setUsers);
            // init teams
            this._setTeams();
            this._setBarrels();
            this._setUsers();
        })
        .catch(error => NotificationActions.error("Erreur lors de la lecture des infos sur les bars.", error));
    }

    componentWillUnmount() {
        // clear store
        TeamStore.unloadData(this.TeamStoreToken);
        BarrelStore.unloadData(this.TeamStoreToken);
        BarrelTypeStore.unloadData(this.TeamStoreToken);
        UserStore.unloadData(this.UserStoreToken);
        SessionStore.unloadData(this.SessionStoreToken);
        // remove the listener
        TeamStore.removeChangeListener(this._setTeams);
        BarrelStore.removeChangeListener(this._setBarrels);
        UserStore.removeChangeListener(this._setUsers);
        SessionStore.removeChangeListener(this._setUsers);
    }

    /**
     * Update the teams in the state with the teams from TeamStore
     */
    _setTeams() {
        this.setState({ teams: TeamStore.teams });
    }

    /**
     * Count the number of active users for each team, and set the localStorage
     */
    _setUsers() {
        const storeUsers = UserStore.users;
        let users = {};

        // loop through sessions
        for (let session of SessionStore.sessions) {
            // get the user
            const user = UserStore.findById(session.user);
            if (user) {
                // if the user is active, increment the number of active user for this team
                if (session.lastAction >= session.disconnectedAt) {
                    if (users[user.team]) {
                        // check if the user is not already in the active users of this team
                        if (!users[user.team].includes(user.id)) {
                            users[user.team].push(user.id);
                        }
                    } else {
                        users[user.team] = [user.id];
                    }
                }
            }
        }

        this.setState({ users });
    }

    /**
     * Update the barrels in the state with the barrels from BarrelStore
     */
    _setBarrels() {
        const storeBarrels = BarrelStore.barrels;
        let barrels = {};

        for (let barrel of storeBarrels) {
            if (barrel.teamId) {
                // if the place doesn't exists in the barrels object, create it
                if (!barrels[barrel.teamId]) {
                    barrels[barrel.teamId] = {cost: 0, profitability: 0};
                }
                // if the state doesn't exist in the place, create it
                if (!barrels[barrel.teamId][barrel.state]) {
                    barrels[barrel.teamId][barrel.state] = [];
                }
                barrels[barrel.teamId][barrel.state].push(barrel);

                // price
                const barrelType = BarrelTypeStore.findById(barrel.typeId);
                if (barrel.state === "empty") {
                    barrels[barrel.teamId].cost += barrelType.supplierPrice;
                    barrels[barrel.teamId].profitability += barrelType.sellPrice;
                }
            }
        }

        this.setState({ barrels });
    }

    render() {

        const fakeAlerts = {
            "done": [],
            "warning": [],
            "serious": [],
        };

        return (
            <div className="BarList_container">
                <Row>
                {
                    this.state.teams.map(team => {
                        return <Col key={team.id} xs sm={3}>
                                    <BarCard
                                        team={team}
                                        barrels={this.state.barrels[team.id]}
                                        users={this.state.users[team.id]}
                                        alerts={fakeAlerts}
                                    />
                                </Col>
                    })
                }
                </Row>
            </div>
        );
    }

}
