import React from 'react';
import * as c from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import AlertList from 'components/log/AlertList.jsx';
import AlertStore from 'stores/AlertStore';
import TeamStore from 'stores/TeamStore';
import UserStore from 'stores/UserStore';
import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';
import NotificationActions from 'actions/NotificationActions';
import ReceiverSelect from 'components/log/ReceiverSelect.jsx';
import { Row, Col } from 'react-flexbox-grid';

require('styles/log/Alerts.scss');

export default class Alerts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alertsDone: [],
            alerts: [],
            filteredAlerts: [],

            receiverFilter: [],
            isDoneFilter: false,
            newAlerts: {},
        };

        this.AlertStoreToken = null;
        this.TeamStoreToken = null;
        this.UserStoreToken = null;

        this._setAlerts = this._setAlerts.bind(this);
        this._setNewAlerts = this._setNewAlerts.bind(this);
        this._handleFilter = this._handleFilter.bind(this);
    }

    componentDidMount() {
        AlertStore.loadData(null)
            .then(data => {
                AlertStore.unloadData(this.AlertStoreToken);
                this.AlertStoreToken = data.token;
                return UserStore.loadData(null);
            })
            .then(data => {
                UserStore.unloadData(this.UserStoreToken);
                this.UserStoreToken = data.token;
                return TeamStore.loadData(null);
            })
            .then(data => {
                TeamStore.unloadData(this.TeamStoreToken);
                this.TeamStoreToken = data.token;

                // Init receiver filter
                let receiverFilter = [];
                if(localStorage.getItem('alertReceivers')) {
                    try {
                        receiverFilter = JSON.parse(localStorage.getItem('alertReceivers'));
                    } catch (e) {
                        receiverFilter = [];
                        console.error('localstorage notificationConfiguration json parsing error', e);
                    }
                }
                else {
                    if(AuthStore.can('ui/receiveAlerts')) {
                        receiverFilter.push(AuthStore.team.id);
                    }
                    if(AuthStore.can('ui/receiveDefaultAlerts')) {
                        receiverFilter.push(null);
                    }
                    if(receiverFilter.length == 0) {
                        let teams = TeamStore.findByPermission('ui/receiveAlerts');
                        for (let team of teams) {
                            receiverFilter.push(team.id);
                        }
                        receiverFilter.push(null);
                    }
                }
                this.setState({receiverFilter});
                localStorage.setItem('alertReceivers', JSON.stringify(this.state.receiverFilter));
                if(global.Android) Android.setAlertReceivers(JSON.stringify(this.state.receiverFilter));

                // First update of the component with data
                this._setAlerts();
            })
            .catch(error => {
                NotificationActions.error('Une erreur s\'est produite pendant le chargement des alertes', error);
            });

        AlertStore.addChangeListener(this._setAlerts);
        AlertStore.addNewListener(this._setNewAlerts);
        TeamStore.addChangeListener(this._setAlerts);
    }

    componentWillUnmount() {
        // clean stores
        AlertStore.unloadData(this.AlertStoreToken);
        TeamStore.unloadData(this.TeamStoreToken);
        // remove listeners
        AlertStore.removeChangeListener(this._setAlerts);
        AlertStore.removeNewListener(this._setNewAlerts);
        TeamStore.removeChangeListener(this._setAlerts);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.alerts.length || this.state.alertsDone.length) {
            if (prevState.isDoneFilter !== this.state.isDoneFilter || prevState.receiverFilter.length !== this.state.receiverFilter.length ) {
                this._setFilteredAlerts();
            }
        }

        if(prevState.receiverFilter.length != this.state.receiverFilter.length) {
            localStorage.setItem('alertReceivers', JSON.stringify(this.state.receiverFilter));
            if(global.Android) Android.setAlertReceivers(JSON.stringify(this.state.receiverFilter));
        }
    }

    _setAlerts() {
        if (AlertStore.length && TeamStore.length) {
            let alerts = [];
            let alertsDone = [];
            for (let alert of AlertStore.alerts) {
                alert.sender = TeamStore.findById(alert.sender);
                alert.receiver = TeamStore.findById(alert.receiver);
                if (alert.severity !== 'done') {
                    alerts.push(alert);
                } else {
                    alertsDone.push(alert);
                }
            }

            this.setState({ alerts, alertsDone, newAlerts: AlertStore.newAlerts });
            this._setFilteredAlerts();
        }
    }

    _setNewAlerts(alert) {
        let team = TeamStore.findById(alert.sender);
        this.setState({
            newAlerts: AlertStore.newAlerts,
        });
    }

    _setFilteredAlerts() {
        if (this.state.alerts.length || this.state.alertsDone.length) {
            let receiveDefaultTeams = TeamStore.findByPermission('ui/receiveDefaultAlerts');
            let filteredAlerts = (this.state.isDoneFilter?this.state.alertsDone:this.state.alerts).filter((alert) => (
                ((this.state.isDoneFilter && alert.severity === 'done') || (!this.state.isDoneFilter && alert.severity !== 'done')) &&
                (this.state.receiverFilter.length === 0 ||
                (this.state.receiverFilter.includes((alert.receiver && alert.receiver.id) || null)))
            ));

            // Order by modification for "done" list and by creation and assignation for "not done" list
            if(this.state.isDoneFilter) {
                filteredAlerts = filteredAlerts.sort((a, b) => {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
                filteredAlerts = filteredAlerts.slice(0, 30);
            }
            else {
                filteredAlerts = filteredAlerts.sort((a, b) => {
                    if((a.users.length == 0) == (b.users.length == 0)) {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    }
                    else if(a.users.length == 0) {
                        return -1;
                    }
                    return 1;
                });
            }

            this.setState({filteredAlerts: filteredAlerts});
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
            <div className="alerts">
                <Paper className="alerts__filters">
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
                                    teams={TeamStore.findByPermission('ui/receiveAlerts')}
                                    value={this.state.receiverFilter}
                                    onChange={(v) => this.setState({ receiverFilter: v })}
                                />
                            </Col>
                        }
                    </Row>
                </Paper>
                <div className="alerts__container">
                    <AlertList alerts={this.state.filteredAlerts} />
                </div>
            </div>
        );
    }
}
