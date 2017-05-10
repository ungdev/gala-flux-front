import React from 'react';
import * as c from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import AlertList from 'components/log/AlertList.jsx';
import AlertStore from 'stores/AlertStore';
import TeamStore from 'stores/TeamStore';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';
import ReceiverSelect from 'components/log/ReceiverSelect.jsx';
import { Row, Col } from 'react-flexbox-grid';
import FluxNotification from 'components/partials/FluxNotification.jsx';

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
            notify: null
        };

        this.AlertStoreToken = null;
        this.TeamStoreToken = null;

        this._setAlerts = this._setAlerts.bind(this);
        this._setNewAlerts = this._setNewAlerts.bind(this);
        this._handleFilter = this._handleFilter.bind(this);
    }

    componentDidMount() {
        AlertStore.loadData(null)
            .then(data => {
                AlertStore.unloadData(this.AlertStoreToken);
                this.AlertStoreToken = data.token;
                return TeamStore.loadData(null);
            })
            .then(data => {
                TeamStore.unloadData(this.TeamStoreToken);
                this.TeamStoreToken = data.token;

                // Init receiver filter
                let receiverFilter = [];
                if(AuthStore.can('ui/receiveAlerts')) {
                    receiverFilter.push(AuthStore.team.id);
                }
                if(AuthStore.can('ui/receiveDefaultAlerts')) {
                    receiverFilter.push(undefined);
                }
                this.setState({receiverFilter});

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
        if (this.state.alerts.length) {
            if (prevState.isDoneFilter !== this.state.isDoneFilter || prevState.receiverFilter.length !== this.state.receiverFilter.length ) {
                this._setFilteredAlerts();
            }
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
            notify: {title: 'Alerte' + (team?' de ' + team.name: ''), content: alert.title},
        });
    }

    _setFilteredAlerts() {
        if (this.state.alerts.length || this.state.alertsDone.length) {
            let receiveDefaultTeams = TeamStore.findByPermission('ui/receiveDefaultAlerts');
            let filteredAlerts = (this.state.isDoneFilter?this.state.alertsDone:this.state.alerts).filter((alert) => (
                ((this.state.isDoneFilter && alert.severity === 'done') || (!this.state.isDoneFilter && alert.severity !== 'done')) &&
                (this.state.receiverFilter.length === 0 ||
                (this.state.receiverFilter.includes(alert.receiver ? alert.receiver.id : alert.receiver)))
            ));
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
            <div className="alerts" onClick={_ => this.setState({ notify: false })}>
                <Paper className="alerts__filters">
                    <Row center="sm">
                        <Col xs={12} sm={4}>
                            <RaisedButton
                                label={`En cours ${this.state.newAlerts.processing ? `(${this.state.newAlerts.processing})` : ''}`}
                                onTouchTap={_ => this._handleFilter('processing')}
                                backgroundColor={(!this.state.isDoneFilter ? c.cyanA700 : '')}
                                fullWidth={true}
                            />
                        </Col>
                        <Col xs={12} sm={4}>
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
                {
                    this.state.notify &&
                    <FluxNotification title={this.state.notify.title} content={this.state.notify.content} />
                }
            </div>
        );
    }
}
