import React from 'react';
import * as c from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import AlertStore from 'stores/AlertStore';
import TeamStore from 'stores/TeamStore';
import UserStore from 'stores/UserStore';
import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';
import NotificationActions from 'actions/NotificationActions';
import { Row, Col } from 'react-flexbox-grid';
import ReceiverSelect from 'app/Alerts/components/ReceiverSelect.jsx';
import AlertList from 'app/Alerts/components/AlertList.jsx';
import DataLoader from "app/components/DataLoader.jsx";

require('./AlertScene.scss');

export default class AlertScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alertsDone: [],
            alerts: [],
            users: null,
            teams: null,
            filteredAlerts: [],

            receiverFilter: [],
            isDoneFilter: false,
            newAlerts: {},
        };

        // Init filters
        if(localStorage.getItem('alertReceivers')) {
            try {
                this.state.receiverFilter = JSON.parse(localStorage.getItem('alertReceivers'));
            } catch (e) {
                this.state.receiverFilter = [];
                console.error('localstorage notificationConfiguration json parsing error', e);
            }
        }
        if (this.state.receiverFilter.length == 0) {
            if(AuthStore.can('ui/receiveAlerts')) {
                this.state.receiverFilter.push(AuthStore.team.id);
            }
            if(AuthStore.can('alert/nullReceiver')) {
                this.state.receiverFilter.push(null);
            }
        }

        // this._handleFilter = this._handleFilter.bind(this);
        this.handleDatastoreChange = this.handleDatastoreChange.bind(this);
    }

    /**
     * Update state when store are updated
     */
    handleDatastoreChange(datastore) {
        this.setState({
            alerts: datastore.Alert.sort((a, b) => {
                // If not done, order by assigned then createdAt
                if(a.severity !== 'done') {
                    // Order by "assigned" only if not done
                    if (a.users.length < b.users.length) return -1;
                    if (a.users.length > b.users.length) return 1;
                    // Then order by created date
                    if (a.createdAt < b.createdAt) return -1;
                    if (a.createdAt > b.createdAt) return 1;
                }
                // If done, order by updated date (should be the date of validation)
                // We want last validated error to be on top
                else {
                    if (a.updatedAt > b.updatedAt) return -1;
                    if (a.updatedAt < b.updatedAt) return 1;
                }
                return 0;
            }),
            users: datastore.User,
            teams: datastore.Team,
        })
    }


    componentDidUpdate(prevProps, prevState) {
        if(prevState.receiverFilter.length != this.state.receiverFilter.length) {
            localStorage.setItem('alertReceivers', JSON.stringify(this.state.receiverFilter));
            if(global.Android) Android.setAlertReceivers(JSON.stringify(this.state.receiverFilter));
        }
    }

    /**
     * Handle click on a filter button
     * @param clicked
     */
    _handleFilter(clicked) {
        this.setState({ isDoneFilter: clicked === 'done' });
        AlertStore._resetNewAlerts(clicked);
    }

    render() {
        return (
            <div className="AlertScene">
                <Paper className="AlertScene__filters">
                    <Row center="sm">
                        <Col xs={6} sm={4}>
                            <RaisedButton
                                label={`En cours ${this.state.newAlerts.processing ? `(${this.state.newAlerts.processing})` : ''}`}
                                onTouchTap={_ => this._handleFilter('processing')}
                                backgroundColor={(!this.state.isDoneFilter ? c.cyanA700 : '')}
                                fullWidth={true}
                            />
                        </Col>
                        <Col xs={6} sm={4}>
                            <RaisedButton
                                label={`Terminées ${this.state.newAlerts.done ? `(${this.state.newAlerts.done})` : ''}`}
                                onTouchTap={_ => this._handleFilter('done')}
                                backgroundColor={(this.state.isDoneFilter ? c.cyanA700 : '')}
                                fullWidth={true}
                            />
                        </Col>
                        {
                            AuthStore.can('alert/admin') &&
                            <Col xs={12} sm={4}>
                                <ReceiverSelect
                                    teams={this.state.teams ? this.state.teams.findByPermission('ui/receiveAlerts') : []}
                                    value={this.state.receiverFilter}
                                    onChange={(v) => this.setState({ receiverFilter: v })}
                                />
                            </Col>
                        }
                    </Row>
                </Paper>
                <DataLoader
                    filters={new Map([
                        ['Alert', [{
                            severity: (this.state.isDoneFilter ? 'done' : ['warning', 'serious']),
                            receiverTeamId: this.state.receiverFilter,
                        },
                        (this.state.receiverFilter.includes(null) ? {
                            severity: (this.state.isDoneFilter ? 'done' : ['warning', 'serious']),
                            receiverTeamId: null,
                        }
                        : undefined),

                        ]],
                        ['User', null ],
                        ['Team', null ],
                    ])}
                    onChange={ datastore => this.handleDatastoreChange(datastore) }
                >
                    { () => (
                            <div className="AlertScene__container">
                                <AlertList
                                    alerts={this.state.alerts}
                                    teams={this.state.teams}
                                    users={this.state.users}
                                    />
                            </div>
                    )}
                </DataLoader>
            </div>
        );
    }
}
