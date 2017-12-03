import React from 'react';

import TeamStore from 'stores/TeamStore';
import BarrelStore from 'stores/BarrelStore';
import UserStore from 'stores/UserStore';
import SessionStore from 'stores/SessionStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import NotificationActions from 'actions/NotificationActions';

import Grid from 'material-ui/Grid';
import TeamCard from 'app/Overview/components/TeamCard.jsx';
import DataLoader from 'app/components/DataLoader.jsx';

require('./OverviewScene.scss');

export default class OverviewScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userNames: null,
        };

        // binding
        this.handleDatastoreChange = this.handleDatastoreChange.bind(this);
    }

    /**
     * Update state when store are updated
     */
    handleDatastoreChange(datastore) {
        // Count the number of active users for each team and generate username list
        let userNames = {};
        for (let session of datastore.Session.values()) {
            // get the user
            const user = datastore.User.get(session.userId);
            if (user) {
                // if the user is active, increment the number of active user for this team
                if (userNames[user.teamId]) {
                    // check if the user is not already in the active users of this team
                    if (!userNames[user.teamId].includes(user.name)) {
                        userNames[user.teamId].push(user.name);
                    }
                } else {
                    userNames[user.teamId] = [user.name];
                }
            }
        }

        // Count barrels for each team
        let prices = {};
        let barrelList = {};
        let barrelCount = {};
        for (let barrel of datastore.Barrel.values()) {
            if (barrel.teamId) {
                const barrelType = datastore.BarrelType.get(barrel.typeId);

                // prices
                if (!prices[barrel.teamId]) {
                    prices[barrel.teamId] = {supplierPrice: 0, sellPrice: 0};
                }
                if (barrel.state === 'empty') {
                    prices[barrel.teamId].supplierPrice += barrelType.supplierPrice;
                    prices[barrel.teamId].sellPrice += barrelType.sellPrice;
                }

                // BarrelList
                if (!barrelList[barrel.teamId]) {
                    barrelList[barrel.teamId] = {};
                }
                if (!barrelList[barrel.teamId][barrel.state]) {
                    barrelList[barrel.teamId][barrel.state] = {};
                }
                if (!barrelList[barrel.teamId][barrel.state][barrelType.shortName]) {
                    barrelList[barrel.teamId][barrel.state][barrelType.shortName] = 0;
                }
                barrelList[barrel.teamId][barrel.state][barrelType.shortName] += 1;

                // count
                if (!barrelCount[barrel.teamId]) {
                    barrelCount[barrel.teamId] = {};
                }
                if (!barrelCount[barrel.teamId][barrel.state]) {
                    barrelCount[barrel.teamId][barrel.state] = 0;
                }
                barrelCount[barrel.teamId][barrel.state] += 1;
            }
        }

        // Count alerts for each team
        let alertList = {};
        for (let alert of datastore.Alert.values()) {
            if (!alertList[alert.senderTeamId]) {
                alertList[alert.senderTeamId] = {};
            }
            if (!alertList[alert.senderTeamId][alert.severity]) {
                alertList[alert.senderTeamId][alert.severity] = [];
            }
            alertList[alert.senderTeamId][alert.severity].push(alert.title);
        }

        this.setState({
            userNames,
            prices,
            barrelList,
            barrelCount,
            alertList,
            teams: datastore.Team.sortBy('name'),
        });
    }

    render() {
        return (
            <DataLoader
                filters={new Map([
                    ['Team', null],
                    ['Alert', null],
                    ['Barrel', null],
                    ['BarrelType', null],
                    ['User', null],
                    ['Session', {disconnectedAt: null}],
                ])}
                onChange={ datastore => this.handleDatastoreChange(datastore) }
            >
                { () => (
                    <div className="OverviewScene">
                        <Grid container spacing={8}>
                        {
                            this.state.teams.map(team => {
                                return (<Grid item key={team.id} xs={12} sm={6} md={3} xl={2}>
                                            <TeamCard
                                                team={team}
                                                userNames={this.state.userNames[team.id] || []}
                                                prices={this.state.prices[team.id] || {}}
                                                barrelList={this.state.barrelList[team.id] || {}}
                                                barrelCount={this.state.barrelCount[team.id] || {}}
                                                alertList={this.state.alertList[team.id] || {}}
                                            />
                                        </Grid>);
                            })
                        }
                        </Grid>
                    </div>
                )}
            </DataLoader>
        )
    }

}
