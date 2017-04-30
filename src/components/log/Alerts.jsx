import React from 'react';
import * as c from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import AlertList from './AlertList.jsx';
import AlertStore from '../../stores/AlertStore';
import TeamStore from '../../stores/TeamStore';
import NotificationActions from '../../actions/NotificationActions';

require('../../styles/log/Alerts.scss');

export default class Alerts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedButton: 1,
            alerts: [],
            filteredAlerts: [],
        };

        this.AlertStoreToken = null;
        this.TeamStoreToken = null;

        this._setAlerts = this._setAlerts.bind(this);
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
            })
            .catch(error => {
                NotificationActions.error('Une erreur s\'est produite pendant le chargement des alertes', error);
            });
        AlertStore.addChangeListener(this._setAlerts);
        TeamStore.addChangeListener(this._setAlerts);
    }

    componentWillUnmount() {
        AlertStore.unloadData(this.AlertStoreToken);
        TeamStore.unloadData(this.TeamStoreToken);
        AlertStore.removeChangeListener(this._setAlerts);
        TeamStore.removeChangeListener(this._setAlerts);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.alerts.length) {
            if (prevState.selectedButton !== this.state.selectedButton) {
                this._setFilteredAlerts();
            }
        }
    }

    _setAlerts() {
        if (AlertStore.alerts.length && TeamStore.teams.length) {
            let alerts = [];
            for (let alert of AlertStore.alerts) {
                // check if not already converted
                if (typeof alert.sender !== 'object') {
                    alert.sender = TeamStore.findById(alert.sender);
                    alert.receiver = TeamStore.findById(alert.receiver);
                }
                alerts.push(alert);
            }
            this.setState({ alerts: alerts });
            this._setFilteredAlerts();
        }
    }

    _setFilteredAlerts() {
        if (this.state.alerts.length) {
            let filteredAlerts = [];
            switch (this.state.selectedButton) {
                case 1:
                    filteredAlerts = this.state.alerts.filter((alert) => alert.users.length === 0 );
                    break;
                case 2:
                    filteredAlerts = this.state.alerts.filter((alert) => alert.users.length && alert.severity !== 'done' );
                    break;
                case 3:
                    filteredAlerts = this.state.alerts.filter((alert) => alert.severity === 'done' );
                default:
                    break;
            }
            this.setState({ filteredAlerts: filteredAlerts });
        }
    }

     _toggleUpdateDialog(e) {
        this.setState({ selectedButton: e });
    }

    render() {
        return (
            <div className="alerts">
                <div className="alert__header">Alertes</div>
                <div className="alerts__container">
                    <div className="alerts__buttons">
                        <RaisedButton
                            label="En attente"
                            onTouchTap={this._toggleUpdateDialog.bind(this, 1)}
                            backgroundColor={(this.state.selectedButton === 1 ? c.cyanA700 : '')}
                        />
                        <RaisedButton
                            label="En cours de traitement"
                            onTouchTap={this._toggleUpdateDialog.bind(this, 2)}
                            backgroundColor={(this.state.selectedButton === 2 ? c.cyanA700 : '')}
                        />
                        <RaisedButton
                            label="Terminées"
                            onTouchTap={this._toggleUpdateDialog.bind(this, 3)}
                            backgroundColor={(this.state.selectedButton === 3 ? c.cyanA700 : '')}
                        />
                    </div>
                    <AlertList alerts={this.state.filteredAlerts} filter={this.state.selectedButton} />
                </div>
            </div>
        );
    }
}
