import React from 'react';

import TeamStore from 'stores/TeamStore';
import BarrelStore from 'stores/BarrelStore';
import UserStore from 'stores/UserStore';
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
        // remove the listener
        TeamStore.removeChangeListener(this._setTeams);
        BarrelStore.removeChangeListener(this._setBarrels);
        UserStore.removeChangeListener(this._setUsers);
    }

    /**
     * Update the teams in the state with the teams from TeamStore
     */
    _setTeams() {
        this.setState({ teams: TeamStore.teams });
    }

    /**
     * Update the users in the state with the users from UserStore
     */
    _setUsers() {
        const storeUsers = UserStore.users;
        let users = {};

        for (let user of storeUsers) {
            // if the team doesn't exists in the users object, create it
            if (!users[user.team]) {
                users[user.team] = [];
            }
            // if the user is logged, add it
            if (user.lastDisconnection < user.lastConnection) {
                users[user.team].push(user);
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
            if (barrel.place) {
                // if the place doesn't exists in the barrels object, create it
                if (!barrels[barrel.place]) {
                    barrels[barrel.place] = {cost: 0, profitability: 0};
                }
                // if the state doesn't exist in the place, create it
                if (!barrels[barrel.place][barrel.state]) {
                    barrels[barrel.place][barrel.state] = [];
                }
                barrels[barrel.place][barrel.state].push(barrel);

                // price
                const barrelType = BarrelTypeStore.findById(barrel.type);
                if (barrel.state === "empty") {
                    barrels[barrel.place].cost += barrelType.supplierPrice;
                    barrels[barrel.place].profitability += barrelType.sellPrice;
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
