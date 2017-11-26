import React from 'react';
import Alert from 'app/Alerts/components/Alert.jsx';
import { Row } from 'react-flexbox-grid';

require('./AlertList.scss');

/**
 * @param {ModelCollection} alerts
 * @param {ModelCollection} users
 * @param {ModelCollection} teams
 */
export default class AlertList extends React.Component {

    render() {
        let alertList = [];
        let assigned = false;
        for (alert of this.props.alerts.values()) {
            if(!assigned && alert.users.length != 0 && alert.severity != 'done') {
                assigned = true;
                alertList.push(<h3 key="label-assigned-alerts" style={{width: '100%', marginBottom: '0'}}>Alertes assignées</h3>);
            }
            alertList.push(<Alert
                alert={alert}
                users={this.props.users}
                teams={this.props.teams}
                key={alert.id}
            />);
        }

        return (
            <div className="Alerts__AlertList">
                <Row className="Alerts__AlertList__row">
                    {alertList}
                </Row>
            </div>
        );
    }
}
